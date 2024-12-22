import { Request } from 'express';

export interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface userCreateType extends UserData {
  id: number;
  role: 'customer' | 'admin' | 'manager';
}

export interface registerUserRequest extends Request {
  body: UserData;
}

export interface loginUserType {
  userName: string;
  email: string;
  password: string;
}

export interface loginUserRequest extends Request {
  body: loginUserType;
}

export type AuthCookies = {
  accessToken: string;
  refreshToken: string;
};

export interface AuthRequest extends Request {
  auth: {
    sub: string;
    id?: string;
    role: string;
  };
}

export interface IRefreshTokenPayload {
  id: string;
}
