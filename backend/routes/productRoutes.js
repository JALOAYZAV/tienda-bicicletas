const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.post('/products', verifyToken, isAdmin, createProduct);
router.put('/products/:id', verifyToken, isAdmin, updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;
