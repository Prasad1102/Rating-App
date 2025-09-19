const express = require('express');
const { Store, Rating, User, Sequelize } = require('../models');
const { ratingValidator, validate } = require('../middleware/validators');

const router = express.Router();

// GET /stores
router.get('/', async (req, res) => {
  const userId = req.user.id;
  const { page = 1, size = 10, search = '' } = req.query;
  const offset = (page - 1) * size;
  const where = {};
  if (search) {
    where[Sequelize.Op.or] = [
      { name: { [Sequelize.Op.iLike]: `%${search}%` } },
      { address: { [Sequelize.Op.iLike]: `%${search}%` } }
    ];
  }
  try {
    const { rows, count } = await Store.findAndCountAll({
      where,
      limit: +size,
      offset: +offset,
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
      order: [['name', 'ASC']]
    });

    // Get user's ratings for these stores
    const storeIds = rows.map(s => s.id);
    const userRatings = await Rating.findAll({
      where: { userId, storeId: storeIds }
    });
    const userRatingMap = {};
    userRatings.forEach(r => { userRatingMap[r.storeId] = r.rating; });

    const stores = rows.map(store => ({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: store.dataValues.averageRating ? Number(store.dataValues.averageRating).toFixed(2) : null,
      userRating: userRatingMap[store.id] || null
    }));

    res.json({
      total: count.length || count,
      stores
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// POST /stores/:storeId/rate
router.post('/:storeId/rate', [ratingValidator, validate], async (req, res) => {
  const userId = req.user.id;
  const storeId = req.params.storeId;
  const { rating } = req.body;
  try {
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: 'Store not found' });
    let userRating = await Rating.findOne({ where: { userId, storeId } });
    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = await Rating.create({ userId, storeId, rating });
    }
    res.json({ message: 'Rating submitted', rating: userRating.rating });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

module.exports = router;
