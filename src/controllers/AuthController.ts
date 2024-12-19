import { NextFunction, Response } from 'express';
import { registerUserRequest } from '../types';
import { CreateUser } from '../services/userService';
import logger from '../config/logger';
import { JwtPayload } from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  persistRefreshToken,
} from '../services/tokenService';

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
