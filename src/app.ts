import * as dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import authRouter from './routes/auth';
import path from 'path';
import { errorHandler } from './utils/errorHandler';

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
app.use(errorHandler);

export default app;
