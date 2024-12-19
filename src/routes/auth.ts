import express from 'express';
import { registerUser } from '../controllers/AuthController';
import registerValidator from '../Validator/register-validator';
import { validate } from '../Validator/ValidationChain';

const router = express.Router();

router.post('/register', validate(registerValidator), registerUser);

export default router;
