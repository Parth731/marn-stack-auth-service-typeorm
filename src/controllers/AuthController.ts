import { NextFunction, Response } from 'express';
import { registerUserRequest } from '../types';
import { CreateUser } from '../services/userService';
import logger from '../config/logger';

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

    res.status(201).json({
      message: 'user created!!',
      data: user,
      error: false,
    });
  } catch (error) {
    next(error);
  }
};
