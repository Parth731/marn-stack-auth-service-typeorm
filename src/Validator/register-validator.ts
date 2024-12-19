import { checkSchema } from 'express-validator';

export default checkSchema({
  email: {
    in: ['body'], // Specify the field location in the request
    isEmail: {
      errorMessage: 'Invalid email format', // Custom error message
    },
    optional: false, // Make the email field required
    matches: {
      options: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/], // Custom regex for email
      errorMessage: 'Email does not match the required format',
    },
    notEmpty: {
      errorMessage: 'Email is Required!!',
    },
  },
});
