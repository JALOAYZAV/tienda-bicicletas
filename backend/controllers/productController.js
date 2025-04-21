const { poolPromise, sql } = require('../config/db');
const { verifyToken, isAdmin } = require('../middlewares/authMiddleware');

// Obtener todos los productos (público)
const getProducts = async (req, res) => {
  try {
    const { category_id, brand, color } = req.query;
    const pool = await poolPromise;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Filtros opcionales
    if (category_id) {
      query += ' AND category_id = @category_id';
      params.push({ name: 'category_id', type: sql.Int, value: category_id });
    }
    if (brand) {
      query += ' AND brand = @brand';
      params.push({ name: 'brand', type: sql.VarChar, value: brand });
    }
    if (color) {
      query += ' AND color = @color';
      params.push({ name: 'color', type: sql.VarChar, value: color });
    }

    const request = pool.request();
    params.forEach((param) =>
      request.input(param.name, param.type, param.value)
    );

    const result = await request.query(query);
    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Obtener un producto por ID (público)
const getProductById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('SELECT * FROM products WHERE id = @id');

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: 'Producto no encontrado' });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Crear producto (solo admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      old_price,
      stock,
      brand,
      color,
      category_id,
      image_url,
    } = req.body;

    // Validación de campos obligatorios
    if (!name || !description || !price || !stock || !category_id) {
      return res
        .status(400)
        .json({ success: false, message: 'Faltan campos obligatorios' });
    }

    // ✅ Validación agregada: el precio debe ser mayor a cero
    if (price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: 'El precio debe ser mayor a cero' });
    }

    const pool = await poolPromise;
    await pool
      .request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('price', sql.Decimal(10, 2), price)
      .input('old_price', sql.Decimal(10, 2), old_price || null)
      .input('stock', sql.Int, stock)
      .input('brand', sql.VarChar, brand || null)
      .input('color', sql.VarChar, color || null)
      .input('category_id', sql.Int, category_id)
      .input('image_url', sql.VarChar, image_url || null).query(`
        INSERT INTO products (
          name, description, price, old_price, stock, brand, color, 
          category_id, image_url, created_at
        ) VALUES (
          @name, @description, @price, @old_price, @stock, @brand, @color,
          @category_id, @image_url, GETDATE()
        )
      `);

    res.status(201).json({ success: true, message: 'Producto creado' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Actualizar producto (solo admin)
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const pool = await poolPromise;

    let updateQuery = 'UPDATE products SET ';
    const params = [];
    Object.keys(updates).forEach((key, index) => {
      if (index > 0) updateQuery += ', ';
      updateQuery += `${key} = @${key}`;
      params.push({
        name: key,
        type: key.includes('price')
          ? sql.Decimal(10, 2)
          : key === 'stock'
          ? sql.Int
          : sql.VarChar,
        value: updates[key],
      });
    });

    updateQuery += ', updated_at = GETDATE() WHERE id = @productId';
    params.push({ name: 'productId', type: sql.Int, value: productId });

    const request = pool.request();
    params.forEach((param) =>
      request.input(param.name, param.type, param.value)
    );

    await request.query(updateQuery);
    res.status(200).json({ success: true, message: 'Producto actualizado' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Eliminar producto (solo admin)
const deleteProduct = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input('id', sql.Int, req.params.id)
      .query('DELETE FROM products WHERE id = @id');

    res.status(200).json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
