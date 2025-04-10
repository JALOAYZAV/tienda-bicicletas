/**
 * @file index.js
 * @description Punto de entrada principal del servidor backend de la tienda CRETO.
 * Configura el servidor Express, aplica middlewares y registra las rutas.
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga variables del archivo .env

const app = express();

/**
 * Puerto en el que se levantará el servidor
 * @type {number}
 */
const PORT = process.env.PORT || 3001;

// ========================
// Middlewares
// ========================

/**
 * Habilita CORS para permitir peticiones desde otros orígenes (como el frontend en Astro)
 */
app.use(cors());

/**
 * Middleware para interpretar peticiones con cuerpo en formato JSON
 */
app.use(express.json());

// ========================
// Rutas
// ========================

/**
 * Importación de las rutas de autenticación de usuarios
 */
const userRoutes = require('./routes/authRoutes');

/**
 * Prefijo '/api' para todas las rutas definidas en userRoutes
 * Por ejemplo: /api/register, /api/users
 */
app.use('/api', userRoutes);

// ========================
// Ruta de prueba (GET /)
// ========================

/**
 * Ruta base del servidor para verificar que esté funcionando
 */
app.get('/', (req, res) => {
  res.send('Servidor funcionando y esperando conexiones SQL');
});

// ========================
// Levantar el servidor
// ========================

/**
 * Inicia el servidor Express en el puerto definido
 */
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
