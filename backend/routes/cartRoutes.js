const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');

// Ruta protegida con token
router.get('/cart', verifyToken, getCart);
// router.get('/cart', verifyToken, (req, res) => {
//   res.json({ message: 'Este carrito pertenece a: ' + req.user.name });
// });
router.post('/cart/add', verifyToken, addToCart);
router.delete('/cart/:id', verifyToken, removeFromCart);
router.delete('/cart/clear', verifyToken, clearCart);

module.exports = router;
