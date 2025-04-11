const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const { getOrders, createOrder } = require('../controllers/orderController');

router.get('/orders', verifyToken, getOrders);
router.post('/orders', verifyToken, createOrder);

module.exports = router;
