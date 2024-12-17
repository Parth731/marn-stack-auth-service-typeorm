import { Request, Response } from 'express';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.status(201).json({
    message: 'User created successfully',
  });
};
