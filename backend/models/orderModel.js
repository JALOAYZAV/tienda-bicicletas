const { poolPromise, sql } = require('../config/db');

// Inserta pedido y sus detalles en una transacción
async function insertOrderWithDetails(userId, payment_method, total, cart) {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  await transaction.begin();
  try {
    const request = new sql.Request(transaction);

    const result = await request
      .input('user_id', sql.Int, userId)
      .input('payment_method', sql.VarChar, payment_method)
      .input('total', sql.Decimal(10, 2), total).query(`
        INSERT INTO orders (user_id, payment_method, total)
        OUTPUT INSERTED.id
        VALUES (@user_id, @payment_method, @total)
      `);

    const orderId = result.recordset[0].id;

    for (const item of cart) {
      await request
        .input('order_id', sql.Int, orderId)
        .input('product_id', sql.Int, item.product.id)
        .input('product_name_snapshot', sql.VarChar, item.product.name)
        .input('product_image_snapshot', sql.VarChar, item.product.image_url)
        .input('quantity', sql.Int, item.quantity)
        .input('unit_price', sql.Decimal(10, 2), item.unit_price).query(`
          INSERT INTO order_details (
            order_id, product_id, product_name_snapshot, 
            product_image_snapshot, quantity, unit_price
          ) VALUES (
            @order_id, @product_id, @product_name_snapshot, 
            @product_image_snapshot, @quantity, @unit_price
          )
        `);
    }

    await transaction.commit();
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
}

// Obtiene pedidos con sus detalles
async function getOrdersByUserId(userId) {
  const pool = await poolPromise;
  const orders = await pool
    .request()
    .input('user_id', sql.Int, userId)
    .query(
      'SELECT * FROM orders WHERE user_id = @user_id ORDER BY order_date DESC'
    );

  const orderIds = orders.recordset.map((o) => o.id);
  if (orderIds.length === 0) return [];

  const details = await pool
    .request()
    .query(
      `SELECT * FROM order_details WHERE order_id IN (${orderIds.join(',')})`
    );

  // Agrupar detalles por orden
  const groupedOrders = orders.recordset.map((order) => ({
    ...order,
    items: details.recordset.filter((item) => item.order_id === order.id),
  }));

  return groupedOrders;
}

module.exports = {
  insertOrderWithDetails,
  getOrdersByUserId,
};
