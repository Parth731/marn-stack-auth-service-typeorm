import { Request } from 'express';

export interface ICreateTenants {
  name: string;
  address: string;
}

export interface tenantRequest extends Request {
  body: ICreateTenants;
}

// export interface ICreateTenantsDataType {
//   id: number;
//   userName: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: Roles;
//   password: string;
// }

export interface tenantCreateDataType {
  id: number;
  name: string;
  address: string;
}

export interface tenantCreateDtoType {
  id: number;
  name: string;
  address: string;
}

export interface tenantCreateResObjectType {
  code: number;
  status: string;
  message: string;
  data: {
    tenantCreateDto: tenantCreateDtoType;
  };
  error: boolean;
}
