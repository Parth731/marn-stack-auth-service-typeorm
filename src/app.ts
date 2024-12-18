import * as dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import path from 'path';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`),
});

const app = express();

app.use(express.json());

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
