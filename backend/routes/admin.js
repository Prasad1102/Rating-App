const express = require('express');
const { User, Store, Rating, Sequelize } = require('../models');
const {
  nameValidator,
  addressValidator,
  passwordValidator,
  emailValidator,
  roleValidator,
  validate
} = require('../middleware/validators');
const { requireRole } = require('../middleware/auth');
const bcrypt = require('bcrypt');

const router = express.Router();

// Middleware: ADMIN only
router.use(requireRole(['ADMIN']));

// POST /admin/users
router.post(
  '/users',
  [nameValidator, emailValidator, passwordValidator, addressValidator, roleValidator, validate],
  async (req, res) => {
    const { name, email, password, address, role } = req.body;
    try {
      const exists = await User.findOne({ where: { email } });
      if (exists) return res.status(400).json({ error: 'Email already registered' });
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, address, role });
      res.status(201).json({ message: 'User created', user: { id: user.id, name, email, role } });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
);

// POST /admin/stores
router.post(
  '/stores',
  [
    require('express-validator').body('name').isLength({ min: 20, max: 60 }),
    require('express-validator').body('email').isEmail(),
    require('express-validator').body('address').isLength({ max: 400 }),
    require('express-validator').body('ownerId').optional().isInt(),
    validate
  ],
  async (req, res) => {
    const { name, email, address, ownerId } = req.body;
    try {
      let owner = null;
      if (ownerId) {
        owner = await User.findByPk(ownerId);
        if (!owner || owner.role !== 'OWNER') {
          return res.status(400).json({ error: 'Invalid ownerId' });
        }
      }
      const store = await Store.create({ name, email, address, ownerId: ownerId || null });
      res.status(201).json({ message: 'Store created', store: { id: store.id, name, email } });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create store' });
    }
  }
);

// GET /admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
});

// GET /admin/users
router.get('/users', async (req, res) => {
  const { page = 1, size = 10, name, email, address, role, sort = 'id', order = 'asc' } = req.query;
  const where = {};
  if (name) where.name = { [Sequelize.Op.iLike]: `%${name}%` };
  if (email) where.email = { [Sequelize.Op.iLike]: `%${email}%` };
  if (address) where.address = { [Sequelize.Op.iLike]: `%${address}%` };
  if (role) where.role = role;
  try {
    const { rows, count } = await User.findAndCountAll({
      where,
      limit: +size,
      offset: (+page - 1) * +size,
      order: [[sort, order.toUpperCase()]]
    });
    res.json({ total: count, users: rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /admin/stores
router.get('/stores', async (req, res) => {
  const { page = 1, size = 10, name, email, address, sort = 'id', order = 'asc' } = req.query;
  const where = {};
  if (name) where.name = { [Sequelize.Op.iLike]: `%${name}%` };
  if (email) where.email = { [Sequelize.Op.iLike]: `%${email}%` };
  if (address) where.address = { [Sequelize.Op.iLike]: `%${address}%` };
  try {
    const { rows, count } = await Store.findAndCountAll({
      where,
      limit: +size,
      offset: (+page - 1) * +size,
      include: [
        {
          model: Rating,
          as: 'ratings',
          attributes: []
        }
      ],
      attributes: {
        include: [
          [
            Sequelize.fn('AVG', Sequelize.col('ratings.rating')),
            'averageRating'
          ]
        ]
      },
      group: ['Store.id'],
      order: [[sort, order.toUpperCase()]]
    });
    res.json({
      total: count.length || count,
      stores: rows.map(store => ({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: store.dataValues.averageRating ? Number(store.dataValues.averageRating).toFixed(2) : null
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// GET /admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        {
          model: Store,
          as: 'stores',
          include: [
            {
              model: Rating,
              as: 'ratings',
              attributes: []
            }
          ],
          attributes: {
            include: [
              [
                Sequelize.fn('AVG', Sequelize.col('stores.ratings.rating')),
                'averageRating'
              ]
            ]
          }
        }
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const result = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role
    };
    if (user.role === 'OWNER') {
      result.stores = user.stores.map(store => ({
        id: store.id,
        name: store.name,
        averageRating: store.dataValues.averageRating ? Number(store.dataValues.averageRating).toFixed(2) : null
      }));
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

module.exports = router;
