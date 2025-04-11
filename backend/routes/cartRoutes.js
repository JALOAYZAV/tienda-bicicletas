const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');

// Rutas
router.get('/', verifyToken, cartController.getCart);
router.post('/add', verifyToken, cartController.addToCart);
router.delete('/:id', verifyToken, cartController.removeFromCart);
router.delete('/clear', verifyToken, cartController.clearCart);

module.exports = router;
