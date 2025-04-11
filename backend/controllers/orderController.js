const { poolPromise, sql } = require('../config/db');

const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query(
        'SELECT * FROM orders WHERE user_id = @user_id ORDER BY order_date DESC'
      );

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const createOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

    const cartItems = await pool.request().input('user_id', sql.Int, userId)
      .query(`
        SELECT c.*, p.price, p.stock, p.name as product_name
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = @user_id
      `);

    const items = cartItems.recordset;

    if (items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    // Verificar stock disponible antes de proceder
    const insufficientStock = items.find((item) => item.quantity > item.stock);
    if (insufficientStock) {
      return res.status(400).json({
        message: `Stock insuficiente para el producto: ${insufficientStock.product_name}. Stock disponible: ${insufficientStock.stock}`,
      });
    }

    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const orderResult = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('total', sql.Decimal(10, 2), total).query(`
        INSERT INTO orders (user_id, total)
        OUTPUT INSERTED.id
        VALUES (@user_id, @total)
      `);

    const orderId = orderResult.recordset[0].id;

    for (const item of items) {
      await pool
        .request()
        .input('order_id', sql.Int, orderId)
        .input('product_id', sql.Int, item.product_id)
        .input('product_name_snapshot', sql.VarChar, item.product_name)
        .input('product_image_snapshot', sql.VarChar, item.image_url)
        .input('quantity', sql.Int, item.quantity)
        .input('unit_price', sql.Decimal(10, 2), item.price).query(`
          INSERT INTO order_details (order_id, product_id, product_name_snapshot, product_image_snapshot, quantity, unit_price)
          VALUES (@order_id, @product_id, @product_name_snapshot, @product_image_snapshot, @quantity, @unit_price)
        `);

      await pool
        .request()
        .input('product_id', sql.Int, item.product_id)
        .input('quantity', sql.Int, item.quantity).query(`
          UPDATE products
          SET stock = stock - @quantity
          WHERE id = @product_id
        `);
    }

    await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query('DELETE FROM cart WHERE user_id = @user_id');

    res
      .status(201)
      .json({ message: 'Pedido creado exitosamente', order_id: orderId });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getOrders,
  createOrder,
};
