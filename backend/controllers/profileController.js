const getProfile = (req, res) => {
  res.status(200).json({
    message: 'Perfil del usuario autenticado',
    user: req.user,
  });
};

module.exports = {
  getProfile,
};
