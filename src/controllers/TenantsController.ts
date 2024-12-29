import { NextFunction, Response } from 'express';
import { tenantCreateResObjectType, tenantRequest } from '../types/tenantsType';
import { TenantCreateService } from '../services/tenantsService';
import { tenantCreateDto } from '../Dto/TenantDto';
import { ApiSuccessHandler } from '../utils/ApiSuccess';

export const tenantCreate = async (
  req: tenantRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { name, address } = req.body;

  try {
    const tenant = await TenantCreateService({ name, address });
    const createTenantResObject: tenantCreateResObjectType = {
      code: 201,
      status: 'success',
      message: 'Tenant created!!',
      data: tenantCreateDto(tenant!),
      error: false,
    };

    ApiSuccessHandler(res, createTenantResObject);
  } catch (error) {
    next(error);
  }
};
