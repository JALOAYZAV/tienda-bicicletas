const { poolPromise, sql } = require('../config/db');

const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query('SELECT * FROM cart WHERE user_id = @user_id');

    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).json({ message: 'Error del servidor' });
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
