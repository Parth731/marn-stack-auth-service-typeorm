import { NextFunction, Request, Response } from 'express';
import { HttpError } from 'http-errors';
import logger from '../config/logger';

export const errorHandler = (
  error: HttpError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  logger.error(error.message);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    error: [
      {
        type: error.name,
        message: error.message,
        path: '',
        location: '',
      },
    ],
  });
};
