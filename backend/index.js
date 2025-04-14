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
 * (registro, login, obtener usuarios - sin token por ahora)
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
const categoryRoutes = require('./routes/categoryRoutes');

// Prefijo común para las rutas protegidas
app.use('/api', profileRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api', orderRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

// ========================
// Ruta base de prueba (GET /)
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

  // Mostrar las rutas registradas
  if (app._router && app._router.stack) {
    console.log('📌 Rutas registradas:');
    app._router.stack.forEach((layer) => {
      if (layer.route && layer.route.stack.length > 0) {
        const method = layer.route.stack[0].method.toUpperCase();
        console.log(`${method} ${layer.route.path}`);
      }
    });
  } else {
    console.log('⚠️ No se encontraron rutas registradas.');
  }
});
