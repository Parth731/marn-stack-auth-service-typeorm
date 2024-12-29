import { Response } from 'express';
import {
  loginResObjectType,
  logoutResObjectType,
  refreshTokenResObjectType,
  registerResObjectType,
  selfResObjectType,
} from '../types/userType';
import { tenantCreateResObjectType } from '../types/tenantsType';

export const ApiSuccessHandler = (
  res: Response,
  responseObject:
    | registerResObjectType
    | loginResObjectType
    | selfResObjectType
    | refreshTokenResObjectType
    | logoutResObjectType
    | tenantCreateResObjectType,
): void => {
  res.status(responseObject.code).json({
    status: responseObject.code,
    type: responseObject.status,
    message: responseObject.message,
    data: responseObject.data,
    error: responseObject.error,
  });
};
