import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import authRouter from './routes/auth';
import path from 'path';
import { globalErrorHandler } from './middlewares/globalErrorHandler';

dotenv.config({
  path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const app = express();

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.get(`${process.env.BASE_URL}/`, async (req: Request, res: Response) => {
  //   const error = createHttpError(401, 'you can not access this route');
  //   next(error);
  res.send('Welcome to the API!!!');
});

app.use(`${process.env.BASE_URL}/auth`, authRouter);

// global error handler
app.use(globalErrorHandler);

export default app;
