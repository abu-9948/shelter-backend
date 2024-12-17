import { body, validationResult } from 'express-validator';


// Validation Middleware for Registration
export const validateRegister = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').isMobilePhone().withMessage('Invalid phone number'),
  body('role').isIn(['admin', 'user']).withMessage('Invalid role, must be "admin" or "user"'),
  
  // Custom middleware to check for validation errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').exists().withMessage('Password is required')
  ];