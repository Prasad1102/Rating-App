const express = require('express');
const { Store, Rating, User, Sequelize } = require('../models');
const { requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(requireRole(['OWNER']));

// GET /owner/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    const result = stores.map(store => ({
      id: store.id,
      name: store.name,
      averageRating: store.ratings.length
        ? (store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length).toFixed(2)
        : null,
      ratings: store.ratings.map(r => ({
        userId: r.user.id,
        name: r.user.name,
        email: r.user.email,
        rating: r.rating
      }))
    }));

    res.json({ stores: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch owner dashboard' });
  }
});

module.exports = router;
