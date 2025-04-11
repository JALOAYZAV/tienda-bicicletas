const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
  getCategories,
  createCategory,
} = require('../controllers/categoryController');

router.get('/categories', getCategories);
router.post('/categories', verifyToken, isAdmin, createCategory);

module.exports = router;
