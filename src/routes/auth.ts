import express from 'express';
import { registerUser } from '../controllers/AuthController';

const router = express.Router();

router.post('/register', registerUser);

export default router;