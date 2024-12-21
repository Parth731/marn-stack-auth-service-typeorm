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
  generateAccessToken,
  generateRefreshToken,
  persistRefreshToken,
} from '../services/tokenService';
import createHttpError from 'http-errors';
import { comparePassword } from '../services/CredentialService';

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

    //Add token to cookie
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
  const user = await findById(Number(req.auth.sub));
  res.status(200).json({ ...user, password: undefined });
};
