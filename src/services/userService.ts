import createHttpError from 'http-errors';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { userCreateType, UserData } from '../types';
import { Roles, saltRounds } from '../constants';
import bcrypt from 'bcrypt';

export const CreateUser = async ({
  userName,
  firstName,
  lastName,
  email,
  password,
}: UserData): Promise<userCreateType> => {
  const userRepository = AppDataSource.getRepository(User);

  //userName unique
  const uniqueUserName = await userRepository.findOne({
    where: { userName: userName },
  });
  if (uniqueUserName) {
    const error = createHttpError(400, 'Username is already exists!');
    throw error;
  }

  //email unique
  const uniqueEmail = await userRepository.findOne({ where: { email: email } });
  if (uniqueEmail) {
    const error = createHttpError(400, 'Email is already exists!');
    throw error;
  }

  //hash password
  const hashPassword = await bcrypt.hash(password, saltRounds);

  try {
    const user = await userRepository.save({
      userName,
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
