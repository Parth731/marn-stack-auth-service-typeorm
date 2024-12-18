import createHttpError from 'http-errors';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { userCreateType, UserData } from '../types';
import { Roles, saltRounds } from '../constants';
import bcrypt from 'bcrypt';

export const CreateUser = async ({
  firstName,
  lastName,
  email,
  password,
}: UserData): Promise<userCreateType> => {
  const userRepository = AppDataSource.getRepository(User);
  //email unique
  const user = await userRepository.findOne({ where: { email: email } });
  if (user) {
    const error = createHttpError(400, 'Email is already exists!');
    throw error;
  }

  //hash password
  const hashPassword = await bcrypt.hash(password, saltRounds);

  try {
    const user = await userRepository.save({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role: Roles.CUSTOMER,
    });
    return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    const customError = createHttpError(
      500,
      'failed to store the data in the database',
    );
    throw customError;
  }
};
