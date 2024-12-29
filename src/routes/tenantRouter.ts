import express from 'express';
import {
  deleteTenant,
  getAllTenants,
  getTenantById,
  tenantCreate,
  updateTenant,
} from '../controllers/TenantsController';
import tenantsValidator from '../Validator/tenants-validator';
import { validate } from '../Validator/ValidationChain';
import authenticate from '../middlewares/authenticate';
import { Roles } from '../types';
import { canAccess } from '../middlewares/canAccess';

const router = express.Router();

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN, Roles.CUSTOMER]),
  validate(tenantsValidator),
  tenantCreate,
);
router.patch(
  '/:id',
  authenticate,
  canAccess([Roles.ADMIN, Roles.CUSTOMER]),
  validate(tenantsValidator),
  updateTenant,
);
router.get('/', getAllTenants);
router.get(
  '/:id',
  authenticate,
  canAccess([Roles.ADMIN, Roles.CUSTOMER]),
  getTenantById,
);
router.delete(
  '/:id',
  authenticate,
  canAccess([Roles.ADMIN, Roles.CUSTOMER]),
  deleteTenant,
);

export default router;
