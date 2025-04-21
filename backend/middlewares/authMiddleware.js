const jwt = require('jsonwebtoken');

// Verifica si el token JWT es válido
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};

// Verifica si el usuario tiene rol admin (role_id === 2)
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  if (req.user.role_id === 2) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado. Solo admins.' });
};

module.exports = {
  verifyToken,
  isAdmin,
};
