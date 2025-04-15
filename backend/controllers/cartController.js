const { poolPromise, sql } = require('../config/db');

// Obtener carrito con precios totales por ítem
const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

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

    const cartItems = result.recordset.map((item) => ({
      cart_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: (item.price * item.quantity).toFixed(2),
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
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Agregar al carrito con validación
const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { product_id, quantity } = req.body;
    const pool = await poolPromise;

    if (!product_id || !quantity || quantity <= 0) {
      return res
        .status(400)
        .json({ message: 'Producto y cantidad válidos requeridos' });
    }

    const productResult = await pool
      .request()
      .input('product_id', sql.Int, product_id)
      .query('SELECT stock FROM products WHERE id = @product_id');

    if (productResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const stock = productResult.recordset[0].stock;

    const currentCartResult = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('product_id', sql.Int, product_id)
      .query(
        'SELECT quantity FROM cart WHERE user_id = @user_id AND product_id = @product_id'
      );

    const currentQty = currentCartResult.recordset[0]?.quantity || 0;

    if (quantity + currentQty > stock) {
      return res
        .status(400)
        .json({ message: 'No hay suficiente stock disponible' });
    }

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

    res
      .status(200)
      .json({ message: 'Producto agregado al carrito correctamente' });
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Eliminar producto del carrito con validación
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const productId = parseInt(req.params.id);
    const pool = await poolPromise;

    if (isNaN(productId)) {
      return res.status(400).json({ message: 'ID de producto inválido' });
    }

    const result = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('product_id', sql.Int, productId)
      .query(
        'SELECT * FROM cart WHERE user_id = @user_id AND product_id = @product_id'
      );

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    await pool
      .request()
      .input('user_id', sql.Int, userId)
      .input('product_id', sql.Int, productId)
      .query(
        'DELETE FROM cart WHERE user_id = @user_id AND product_id = @product_id'
      );

    res
      .status(200)
      .json({ message: 'Producto eliminado del carrito correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Vaciar el carrito con validación previa
const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const pool = await poolPromise;

    const check = await pool
      .request()
      .input('user_id', sql.Int, userId)
      .query('SELECT COUNT(*) AS count FROM cart WHERE user_id = @user_id');

    const totalItems = check.recordset[0].count;

    if (totalItems === 0) {
      return res.status(200).json({
        success: false,
        message: 'El carrito ya está vacío',
      });
    }

    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      const request = new sql.Request(transaction);
      await request
        .input('user_id', sql.Int, userId)
        .query('DELETE FROM cart WHERE user_id = @user_id');

      await transaction.commit();
      res.status(200).json({
        success: true,
        message: 'Carrito vaciado exitosamente',
      });
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({
      success: false,
      message: 'Error al vaciar el carrito',
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
