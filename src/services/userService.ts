import createHttpError from 'http-errors';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { userCreateType, UserData } from '../types';
import { Roles } from '../constants';

export const CreateUser = async ({
  firstName,
  lastName,
  email,
  password,
}: UserData): Promise<userCreateType> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.save({
      firstName,
      lastName,
      email,
      password,
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
