import express from 'express';
import { tenantCreate } from '../controllers/TenantsController';
import tenantsValidator from '../Validator/tenants-validator';
import { validate } from '../Validator/ValidationChain';

const router = express.Router();

router.post('/', validate(tenantsValidator), tenantCreate);

export default router;
