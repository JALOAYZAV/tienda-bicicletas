/**
 * @file authRoutes.js
 * @description Define las rutas relacionadas con autenticación de usuarios para el backend de CRETO.
 * Estas rutas son manejadas por el controlador authController.js.
 */

const express = require('express');
const router = express.Router();
const { getUsers, registerUser } = require('../controllers/authController');

/**
 * @route GET /api/users
 * @description Obtiene todos los usuarios registrados (modo abierto, sin token por ahora).
 * @access Público
 */
router.get('/users', getUsers);

/**
 * @route POST /api/register
 * @description Registra un nuevo usuario en la base de datos.
 * @access Público
 */
router.post('/register', registerUser);

module.exports = router;
