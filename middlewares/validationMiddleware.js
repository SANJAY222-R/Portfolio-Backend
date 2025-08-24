import { body, validationResult } from 'express-validator';
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
export const registerValidationRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name cannot be empty.')
    .isAlpha('en-US', { ignore: ' ' }).withMessage('Name must only contain alphabetic characters.'),

  body('email')
    .notEmpty().withMessage('Email cannot be empty.')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail()
    .custom(value => {
      if (!value.endsWith('@gmail.com')) {
        throw new Error('Email must be a @gmail.com address.');
      }
      return true;
    }),

  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain at least one number.')
    .matches(/[\W_]/).withMessage('Password must contain at least one special character.'),
];