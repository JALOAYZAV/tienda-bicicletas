/**
 * @file index.js
 * @description Punto de entrada principal del servidor backend de la tienda CRETO.
 * Configura el servidor Express, aplica middlewares y registra las rutas protegidas y públicas.
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
// Middlewares Globales
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
// Rutas públicas
// ========================

/**
 * Importación de las rutas de autenticación de usuarios
 * (registro, login, obtener usuarios - sin token)
 */
const userRoutes = require('./routes/authRoutes');
app.use('/api', userRoutes);

// ========================
// Rutas protegidas con JWT
// ========================

/**
 * Importación de las rutas protegidas que requieren token JWT
 */

const profileRoutes = require('./routes/profileRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

// Prefijo común para las rutas protegidas
app.use('/api', profileRoutes);
// app.use('/api', cartRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);


// ========================
// Ruta base de prueba (GET /)
// ========================

/**
 * Ruta base del servidor para verificar que esté funcionando
 */
app.get('/', (req, res) => {
  res.send('Servidor funcionando y esperando conexiones SQL');
});

console.log('Rutas registradas:');
app._router.stack.forEach((layer) => {
  if (layer.route) {
    console.log(
      `${layer.route.stack[0].method.toUpperCase()} ${layer.route.path}`
    );
  }
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
