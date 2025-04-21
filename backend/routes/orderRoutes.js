const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  createOrder,
  getUserOrders,
} = require('../controllers/orderController');

router.post('/', verifyToken, createOrder);
router.get('/', verifyToken, getUserOrders);

module.exports = router;
