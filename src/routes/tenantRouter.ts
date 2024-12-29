import express from 'express';
import { tenantCreate } from '../controllers/TenantsController';
import tenantsValidator from '../Validator/tenants-validator';
import { validate } from '../Validator/ValidationChain';
import authenticate from '../middlewares/authenticate';

const router = express.Router();

router.post('/', authenticate, validate(tenantsValidator), tenantCreate);

export default router;
