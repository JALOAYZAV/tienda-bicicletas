const { poolPromise, sql } = require('../config/db');
const {
  insertOrderWithDetails,
  getOrdersByUserId,
} = require('../models/orderModel');

// Crear nueva orden (con validación de stock)
const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { payment_method, cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    const pool = await poolPromise;

    // Validar stock de cada producto
    for (const item of cart) {
      const result = await pool
        .request()
        .input('product_id', sql.Int, item.product.id)
        .query('SELECT stock FROM products WHERE id = @product_id');

      const available = result.recordset[0]?.stock || 0;
      if (item.quantity > available) {
        return res.status(400).json({
          message: `No hay suficiente stock para el producto: ${item.product.name}`,
        });
      }
    }

    const total = cart.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0
    );

    await insertOrderWithDetails(userId, payment_method, total, cart);

    res.status(201).json({ message: 'Pedido realizado correctamente' });
  } catch (error) {
    console.error('Error al crear orden:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener pedidos del usuario
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await getOrdersByUserId(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
};
