import createHttpError from 'http-errors';
import { User } from '../database/entities/User';
// import { Roles, saltRounds } from '../constants';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../database/data-source';
import { saltRounds } from '../constants';
import { userCreateType, UserData } from '../types/userType';
import { Roles } from '../types';

export const CreateUser = async ({
  userName,
  firstName,
  lastName,
  email,
  password,
}: UserData): Promise<userCreateType> => {
  const userRepository = AppDataSource.getRepository(User);

  // userName unique
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

export const findByEmailAndUserName = async (
  email: string,
  userName: string,
): Promise<User> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: { email: email, userName: userName },
  });
  if (!user) {
    const error = createHttpError(
      400,
      'Username or Email or Password does not match!',
    );
    throw error;
  }
  return user;
};

export const findById = async (id: number): Promise<User | null> => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: {
      id: id,
    },
    // relations: {
    //   tenant: true,
    // },
  });
  return user;
  // throw createHttpError(404, 'User not found');
};
