const { poolPromise, sql } = require('../config/db');

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

    // 1. Verificar si el usuario existe
    const userCheck = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query('SELECT id FROM users WHERE id = @user_id');

    if (userCheck.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // 2. Obtener carrito con información completa de productos
    const result = await pool.request().input('user_id', sql.Int, userId)
      .query(`
        SELECT 
          c.id,
          c.quantity,
          p.id AS product_id,
          p.name,
          p.price,
          p.image_url,
          p.stock
        FROM cart c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = @user_id
      `);

    // 3. Formatear respuesta
    const cartItems = result.recordset.map((item) => ({
      cart_item_id: item.id,
      quantity: item.quantity,
      product: {
        id: item.product_id,
        name: item.name,
        price: item.price,
        image_url: item.image_url,
        stock: item.stock,
      },
    }));

    res.status(200).json({
      success: true,
      count: cartItems.length,
      data: cartItems,
    });
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtener el carrito',
    });
  }
};


const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;
    const pool = await poolPromise;

    await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('product_id', sql.Int, product_id)
      .input('quantity', sql.Int, quantity).query(`
        MERGE cart AS target
        USING (SELECT @user_id AS user_id, @product_id AS product_id) AS source
        ON target.user_id = source.user_id AND target.product_id = source.product_id
        WHEN MATCHED THEN
          UPDATE SET quantity = target.quantity + @quantity
        WHEN NOT MATCHED THEN
          INSERT (user_id, product_id, quantity)
          VALUES (@user_id, @product_id, @quantity);
      `);

    res.status(200).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = req.params.id;
    const pool = await poolPromise;

    await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('product_id', sql.Int, productId)
      .query(
        'DELETE FROM cart WHERE user_id = @user_id AND product_id = @product_id'
      );

    res.status(200).json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query('DELETE FROM cart WHERE user_id = @user_id');

    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
