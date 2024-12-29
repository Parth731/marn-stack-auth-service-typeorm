import express from 'express';
import { tenantCreate } from '../controllers/TenantsController';
import tenantsValidator from '../Validator/tenants-validator';
import { validate } from '../Validator/ValidationChain';
import authenticate from '../middlewares/authenticate';
import { Roles } from '../types';
import { canAccess } from '../middlewares/canAccess';

const router = express.Router();

router.post(
  '/',
  authenticate,
  canAccess([Roles.ADMIN]),
  validate(tenantsValidator),
  tenantCreate,
);

export default router;
