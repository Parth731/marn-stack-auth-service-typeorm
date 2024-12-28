import { Roles } from './index';
import { Request } from 'express';
/** register */
export interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantId?: number;
}

export interface userCreateType extends UserData {
  id: number;
  role: Roles;
}

export interface registerUserRequest extends Request {
  body: UserData;
}

export interface registerDataType {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
  password: string;
}

export interface registerUserDtoType {
  id: number;
  userName: string;
  email: string;
  fullName: string;
  role: Roles;
}

export interface registerResObjectType {
  code: number;
  status: string;
  message: string;
  data: {
    registerUserDto: registerUserDtoType;
  };
  error: boolean;
}

/** login */
export interface loginUserType {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
  password: string;
}

export interface loginUserRequest extends Request {
  body: loginUserType;
}

export interface loginDtoType {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
}

export interface loginResObjectType {
  code: number;
  status: string;
  message: string;
  data: {
    loginUserDto: loginDtoType;
  };
  error: boolean;
}

/** self */
export interface selfDataType {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
  password: string;
}

export interface selfDtoType {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  role: string;
}

export interface selfResObjectType {
  code: number;
  status: string;
  message: string;
  data: {
    selfDto: selfDtoType;
  };
  error: boolean;
}

// refresh token

export interface refreshTokenType {
  id: number;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Roles;
  password: string;
}

export interface refreshTokenDtoType {
  id: number;
  userName: string;
}

export interface refreshTokenResObjectType {
  code: number;
  status: string;
  message: string;
  data: {
    refreshTokenDto: refreshTokenDtoType;
  };
  error: boolean;
}

// logout user

export interface logoutType {
  id: number;
  role: Roles;
}

export interface logoutDtoType {
  id: number;
  role: Roles;
}

export interface logoutResObjectType {
  code: number;
  status: string;
  message: string;
  data: {
    logoutDto: logoutDtoType;
  };
  error: boolean;
}
