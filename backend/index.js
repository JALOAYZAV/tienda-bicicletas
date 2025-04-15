const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Configuración de middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Reemplaza con tu URL de frontend
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
// const authRoutes = require('./routes/authRoutes');
// const userRoutes = require('./routes/userRoutes');
// const cartRoutes = require('./routes/cartRoutes');
// const productRoutes = require('./routes/productRoutes');
// const categoryRoutes = require('./routes/categoryRoutes');

// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/cart', cartRoutes);
// app.use('/api/products', productRoutes);
// app.use('/api/categories', categoryRoutes);

// Manejo de errores centralizado
app.use((err, req, res, next) => {
  console.error('⚠️ Error:', err.stack);
  res
    .status(500)
    .json({ success: false, message: 'Error interno del servidor' });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🔗 Endpoints disponibles:`);
  console.log(`- http://localhost:${PORT}/api/auth/register`);
  console.log(`- http://localhost:${PORT}/api/cart`);
  console.log(`- http://localhost:${PORT}/api/products`);
});
