import fs from 'fs';
import path from 'path';
import { NextFunction, Response } from 'express';
import { registerUserRequest } from '../types';
import { CreateUser } from '../services/userService';
import logger from '../config/logger';
import { JwtPayload, sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';

export const registerUser = async (
  req: registerUserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { firstName, lastName, email, password } = req.body;
  logger.debug('New request to register a user', {
    firstName,
    lastName,
    email,
    password: '******',
  });
  try {
    const user = await CreateUser({ firstName, lastName, email, password });

    logger.info('User has been registered', { id: user.id });

    let privateKey: Buffer;
    try {
      privateKey = fs.readFileSync(
        path.resolve(__dirname, '../../certs/private.pem'),
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      const error = createHttpError(500, 'something went wrong');
      next(error);
      return;
    }
    const payload: JwtPayload = {
      sub: String(user.id),
      role: user.role,
    };
    const accessToken = sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      issuer: process.env.ACCESS_TOKEN_ISSUER,
    });

    const refreshToken = sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      algorithm: 'HS256',
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
      issuer: process.env.REFRESH_TOKEN_ISSUER,
    });

    res.cookie('accessToken', accessToken, {
      domain: 'localhost',
      httpOnly: true, //very important
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60, // cookie expires in 1 hours
    });
    res.cookie('refreshToken', refreshToken, {
      domain: 'localhost',
      httpOnly: true, //very important
      secure: true,
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24 * 365, // cookie expires in 1 year
    });

    res.status(201).json({
      message: 'user created!!',
      data: user,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};
