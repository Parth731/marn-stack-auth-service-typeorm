import { checkSchema } from 'express-validator';
import { updateUserRequest } from '../types/auth';
import { Roles } from '../types';

export default checkSchema({
  userName: {
    in: ['body'],
    trim: true,
    optional: false,
    notEmpty: true,
    matches: {
      options: [/^[a-zA-Z0-9]+$/],
      errorMessage: 'Username must only contain alphanumeric characters',
    },
    isString: {
      errorMessage: 'Username must be a string',
    },
    isLength: {
      options: { min: 3, max: 15 },
      errorMessage: 'Username must be between 3 and 15 characters',
    },
  },
  email: {
    in: ['body'], // Specify the field location in the request
    trim: true,
    isString: {
      errorMessage: 'Email must be a string',
    },
    notEmpty: {
      errorMessage: 'Email is Required',
    },
    isEmail: {
      errorMessage: 'Invalid email format', // Custom error message
    },
    optional: false, // Make the email field required
    matches: {
      options: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/], // Custom regex for email
      errorMessage: 'Email does not match the required format',
    },
  },
  firstName: {
    in: ['body'],
    trim: true,
    optional: false,
    isString: {
      errorMessage: 'First name must be a string',
    },
    notEmpty: {
      errorMessage: 'First name is required',
    },
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: 'First name must be between 1 and 50 characters',
    },
    matches: {
      options: [/^[A-Za-z]+$/],
      errorMessage: 'First name must only contain alphabets',
    },
  },
  lastName: {
    in: ['body'],
    trim: true,
    optional: false,
    isString: {
      errorMessage: 'Last name must be a string',
    },
    notEmpty: {
      errorMessage: 'Last name is required',
    },
    isLength: {
      options: { min: 1, max: 50 },
      errorMessage: 'Last name must be between 1 and 50 characters',
    },
    matches: {
      options: [/^[A-Za-z]+$/],
      errorMessage: 'Last name must only contain alphabets',
    },
  },
  role: {
    errorMessage: 'Role is required!',
    trim: true,
    optional: false,
    isString: {
      errorMessage: 'Role must be a string',
    },
    notEmpty: {
      errorMessage: 'Role is required',
    },
    isIn: {
      options: [Object.values(Roles)],
      errorMessage: `Role must be one of ${Object.values(Roles).join(', ')}`,
    },
  },
  tenantId: {
    errorMessage: 'Tenant id is required!',
    trim: true,
    custom: {
      options: async (value: string, { req }) => {
        const role = (req as updateUserRequest).body.role;
        if (role === 'admin') {
          return true;
        } else {
          return !!value;
        }
      },
    },
  },
});