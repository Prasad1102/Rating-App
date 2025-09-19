const { body, param, query } = require('express-validator');

const nameValidator = body('name')
  .isLength({ min: 20, max: 60 })
  .withMessage('Name must be 20-60 characters');

const addressValidator = body('address')
  .isLength({ max: 400 })
  .withMessage('Address max 400 characters');

const passwordValidator = body('password')
  .isLength({ min: 8, max: 16 })
  .withMessage('Password must be 8-16 characters')
  .matches(/[A-Z]/)
  .withMessage('Password must have at least one uppercase letter')
  .matches(/[!@#$%^&*]/)
  .withMessage('Password must have at least one special character');

const emailValidator = body('email')
  .isEmail()
  .withMessage('Invalid email format');

const ratingValidator = body('rating')
  .isInt({ min: 1, max: 5 })
  .withMessage('Rating must be integer 1-5');

const roleValidator = body('role')
  .isIn(['ADMIN', 'USER', 'OWNER'])
  .withMessage('Role must be ADMIN, USER, or OWNER');

const validate = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(e => e.msg) });
  }
  next();
};

module.exports = {
  nameValidator,
  addressValidator,
  passwordValidator,
  emailValidator,
  ratingValidator,
  roleValidator,
  validate
};
