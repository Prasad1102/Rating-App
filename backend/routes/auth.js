const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const {
  nameValidator,
  addressValidator,
  passwordValidator,
  emailValidator,
  validate
} = require('../middleware/validators');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// POST /auth/register
router.post(
  '/register',
  [
    nameValidator,
    emailValidator,
    passwordValidator,
    addressValidator,
    validate
  ],
  async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ error: 'Email already registered' });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hash,
        address,
        role: 'USER'
      });
      res.status(201).json({ message: 'User registered' });
    } catch (err) {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
);

// POST /auth/login
router.post(
  '/login',
  [emailValidator, passwordValidator, validate],
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) return res.status(400).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(400).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
      res.json({
        token,
        role: user.role,
        name: user.name,
        email: user.email
      });
    } catch (err) {
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// PUT /auth/password
router.put(
  '/password',
  [
    authenticateJWT,
    require('express-validator').body('oldPassword').exists(),
    require('express-validator').body('newPassword')
      .isLength({ min: 8, max: 16 })
      .matches(/[A-Z]/)
      .matches(/[!@#$%^&*]/)
      .withMessage('New password must be 8-16 chars, 1 uppercase, 1 special char'),
    validate
  ],
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    try {
      const user = await User.findByPk(req.user.id);
      const match = await bcrypt.compare(oldPassword, user.password);
      if (!match) return res.status(400).json({ error: 'Old password incorrect' });
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      res.json({ message: 'Password updated' });
    } catch (err) {
      res.status(500).json({ error: 'Password update failed' });
    }
  }
);

module.exports = router;
