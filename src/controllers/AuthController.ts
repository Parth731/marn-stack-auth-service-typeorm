import { NextFunction, Response } from 'express';
import { AuthRequest, loginUserRequest, registerUserRequest } from '../types';
import {
  CreateUser,
  findByEmailAndUserName,
  findById,
} from '../services/userService';
import logger from '../config/logger';
import { JwtPayload } from 'jsonwebtoken';
import {
  deleteRefreshToken,
  generateAccessToken,
  generateRefreshToken,
  persistRefreshToken,
} from '../services/tokenService';
import createHttpError from 'http-errors';
import { comparePassword } from '../services/CredentialService';
import { setResponseCookies } from '../utils/auth.utils';

export const registerUser = async (
  req: registerUserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { firstName, lastName, email, password, userName } = req.body;
  logger.debug('New request to register a user', {
    userName,
    firstName,
    lastName,
    email,
    password: '******',
  });
  try {
    const user = await CreateUser({
      userName,
      firstName,
      lastName,
      email,
      password,
    });

    logger.info('User has been registered', { id: user.id });

    const payload: JwtPayload = {
      sub: String(user.id),
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    //persist refresh token
    const newRefreshToken = await persistRefreshToken(user);

    const refreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshToken.id),
    });

    setResponseCookies(res, accessToken, refreshToken);

    logger.info('token has been created');
    res.status(201).json({
      message: 'user created!!',
      data: user,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: loginUserRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password, userName } = req.body;
  logger.debug('New request to login a user', {
    userName,
    email,
    password: '******',
  });

  try {
    //check if Username is exists
    //check if email is exists
    const existUserName = await findByEmailAndUserName(email, userName);

    //compare password
    const isPasswordMatch = await comparePassword(
      password,
      existUserName?.password,
    );
    if (!isPasswordMatch)
      throw createHttpError(
        400,
        'Username or Email or Password does not match!',
      );

    //generate token
    const payload: JwtPayload = {
      sub: String(existUserName?.id),
      role: existUserName?.role,
    };

    const accessToken = generateAccessToken(payload);

    //persist refresh token
    const newRefreshToken = await persistRefreshToken(existUserName);

    const refreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshToken.id),
    });

    setResponseCookies(res, accessToken, refreshToken);

    logger.info('user has been logged in', { id: existUserName?.id });

    //return response
    res.status(200).json({
      message: 'user logged in!!',
      data: existUserName,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};

export const self = async (req: AuthRequest, res: Response): Promise<void> => {
  //req.auth.id
  const user = await findById(Number(req.auth?.sub));
  res.status(200).json({ ...user, password: undefined });
};

export const refresh = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    /**
    {
      sub: '3',
      role: 'customer',
      id: '7',
      iat: 1734851865,
      exp: 1766409465,
      iss: 'Auth-service',
      jti: '7'
    }
    console.log((req as unknown as AuthRequest).auth);
    */

    //generate token
    const payload: JwtPayload = {
      sub: req.auth.id,
      role: req.auth.role,
    };
    const accessToken = generateAccessToken(payload);

    const existUserName = await findById(Number(req.auth.sub));
    if (!existUserName) {
      const error = createHttpError(
        '400',
        'User with the token could not field',
      );
      next(error);
      return;
    }

    //new persist refresh token generate
    const newRefreshToken = await persistRefreshToken(existUserName);

    logger.info('generate new refresh token');

    //delete old persist refresh token
    await deleteRefreshToken(Number(req.auth.id));

    logger.info('delete old refresh token', { id: req.auth.id });

    const refreshToken = generateRefreshToken({
      ...payload,
      id: String(newRefreshToken.id),
    });

    setResponseCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: 'refresh token and access token generated successfully',
      data: { id: existUserName.id },
      error: false,
    });
  } catch (error) {
    next(error);
  }
};
