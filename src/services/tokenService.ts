import createHttpError from 'http-errors';
import { JwtPayload, sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { User } from '../database/entities/User';
import { RefreshToken } from '../database/entities/RefreshToken';
import { isLeapYear } from '../utils/index';
import { Repository } from 'typeorm';
import { AppDataSource } from '../database/data-source';
import { configEnv } from '../config/config';

export const generateAccessToken = (payload: JwtPayload): string => {
  let privateKey: Buffer;
  try {
    privateKey = fs.readFileSync(
      path.resolve(__dirname, '../../certs/private.pem'),
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    const error = createHttpError(500, 'Error while reading private key');
    throw error;
  }

  const accessToken = sign(payload, privateKey, {
    algorithm: 'RS256',
    expiresIn: String(configEnv.accessTokenExpiresIn),
    issuer: String(configEnv.accessTokenIssuer),
  });
  return accessToken;
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const refreshToken = sign(payload, configEnv.refreshTokenSecret!, {
    algorithm: 'HS256',
    expiresIn: String(configEnv.refreshTokenExpiresIn),
    issuer: String(configEnv.refreshTokenIssuer),
    jwtid: payload.id.toString(), //embed the refresh token id
  });
  return refreshToken;
};

export const persistRefreshToken = async (
  user: User,
): Promise<RefreshToken> => {
  const MS_IN_YEAR = isLeapYear(new Date().getFullYear());
  const refreshTokenRepository: Repository<RefreshToken> =
    AppDataSource.getRepository(RefreshToken);
  const newRefreshToken = await refreshTokenRepository.save({
    user: user,
    expiresAt: new Date(Date.now() + MS_IN_YEAR),
  });
  return newRefreshToken;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const deleteRefreshToken = async (tokenId: number) => {
  const refreshTokenRepository: Repository<RefreshToken> =
    AppDataSource.getRepository(RefreshToken);
  return refreshTokenRepository.delete({ id: tokenId });
};
