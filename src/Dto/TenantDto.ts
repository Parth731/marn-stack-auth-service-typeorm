import {
  tenantCreateDataType,
  tenantCreateDtoType,
} from '../types/tenantsType';

export const tenantCreateDto = (
  tenant: tenantCreateDataType,
): { tenantCreateDto: tenantCreateDtoType } => {
  return {
    tenantCreateDto: {
      id: tenant.id,
      name: tenant.name,
      address: tenant.address,
    },
  };
};
