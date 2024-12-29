import createHttpError from 'http-errors';
import { AppDataSource } from '../database/data-source';
import { Tenant } from '../database/entities/Tenant';
import { ICreateTenants, tenantCreateDataType } from '../types/tenantsType';
import logger from '../config/logger';

export const TenantCreateService = async (
  tenantData: ICreateTenants,
): Promise<tenantCreateDataType | undefined> => {
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const { name, address } = tenantData;

  try {
    const tenant = await tenantRepository.save({
      name,
      address,
    });

    if (!tenant) {
      const customError = createHttpError(
        500,
        'failed to store the tenant data in the database',
      );
      throw customError;
    }

    return tenant;
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
    } else {
      const customError = createHttpError(
        500,
        'failed to store the tenant data in the database',
      );
      throw customError;
    }
  }
};
