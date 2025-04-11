const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

router.get('/profile', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Perfil del usuario autenticado',
    user: req.user,
  });
});

module.exports = router;
