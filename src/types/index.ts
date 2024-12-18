import { Request } from 'express';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface userCreateType extends UserData {
  id: number;
}

export interface registerUserRequest extends Request {
  body: UserData;
}
