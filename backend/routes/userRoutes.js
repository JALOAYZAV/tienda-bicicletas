const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  getAllUsers,
} = require('../controllers/userController');

// Rutas del usuario autenticado
router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);

// Solo admin puede listar todos los usuarios
router.get('/', verifyToken, isAdmin, getAllUsers);

module.exports = router;
