import express from 'express';
import { loginUser, registerUser } from '../controllers/AuthController';
import registerValidator from '../Validator/register-validator';
import { validate } from '../Validator/ValidationChain';
import loginValidator from '../Validator/login-validator';

const router = express.Router();
/**
 * @openapi
 * '/pizza-app/auth-service/api/v1/auth/register':
 *  post:
 *     tags:
 *     - User Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - firstName
 *              - lastName
 *              - email
 *              - password
 *            properties:
 *              firstName:
 *                type: string
 *                default: john
 *              lastName:
 *                type: string
 *                default: john
 *              email:
 *                type: string
 *                default: johndoe@mail.com
 *              password:
 *                type: string
 *                default: JohnDoe20!@
 *     responses:
 *      201:
 *        description: user registered successfully
 *      400:
 *        description: Bad Request
 *      404:
 *        description: Not Found
 *      500:
 *        description: Server Error
 */
router.post('/register', validate(registerValidator), registerUser);

router.post('/login', validate(loginValidator), loginUser);

export default router;
