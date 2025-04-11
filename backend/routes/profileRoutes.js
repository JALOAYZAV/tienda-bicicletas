const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  changePassword,
} = require('../controllers/profileController');

// router.get('/profile', verifyToken, (req, res) => {
//   res.status(200).json({
//     message: 'Perfil del usuario autenticado',
//     user: req.user,
//   });
// });

router.get('/profile', verifyToken, getProfile);
router.put('/profile', verifyToken, updateProfile);
router.put('/profile/password', verifyToken, changePassword);

module.exports = router;
