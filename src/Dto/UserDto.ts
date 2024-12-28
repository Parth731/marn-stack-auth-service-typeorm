import {
  loginDtoType,
  loginUserType,
  logoutDtoType,
  logoutType,
  refreshTokenDtoType,
  refreshTokenType,
  registerDataType,
  registerUserDtoType,
  selfDataType,
  selfDtoType,
} from '../types/userType';

export const registerUserDto = (
  user: registerDataType,
): { registerUserDto: registerUserDtoType } => {
  return {
    registerUserDto: {
      id: user.id,
      userName: user.userName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    },
  };
};

export const loginUserDto = (
  user: loginUserType,
): { loginUserDto: loginDtoType } => {
  return {
    loginUserDto: {
      id: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
      userName: user.userName,
      email: user.email,
      role: user.role,
    },
  };
};

export const selfUserDto = (user: selfDataType): { selfDto: selfDtoType } => {
  return {
    selfDto: {
      id: Number(user?.id),
      fullName: `${user?.firstName} ${user?.lastName}`,
      userName: user?.userName,
      email: user?.email,
      role: user?.role,
    },
  };
};

export const refreshTokenDto = (
  user: refreshTokenType,
): { refreshTokenDto: refreshTokenDtoType } => {
  return {
    refreshTokenDto: {
      id: user.id,
      userName: user.userName,
    },
  };
};

export const logoutDto = (user: logoutType): { logoutDto: logoutDtoType } => {
  return {
    logoutDto: {
      id: Number(user.id),
      role: user.role,
    },
  };
};
