import 'reflect-metadata';
import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';

const app = express();

app.get('/', async (req: Request, res: Response) => {
  //   const error = createHttpError(401, 'you can not access this route');
  //   next(error);
  res.send('Welcome to the API!!!');
});

app.use('/auth', authRouter);

// global error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
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
});

export default app;
