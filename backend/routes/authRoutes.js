const express = require('express');
const router = express.Router();
const {
  getUsers,
  registerUser,
  loginUser,
} = require('../controllers/authController');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

router.get('/users', verifyToken, isAdmin, getUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
