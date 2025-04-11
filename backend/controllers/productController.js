const { poolPromise, sql } = require('../config/db');

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
      frame_size,
      wheel_size,
      country,
      category_id,
      image_url,
    } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('price', sql.Decimal(10, 2), price)
      .input('old_price', sql.Decimal(10, 2), old_price)
      .input('stock', sql.Int, stock)
      .input('brand', sql.VarChar, brand)
      .input('color', sql.VarChar, color)
      .input('frame_size', sql.VarChar, frame_size)
      .input('wheel_size', sql.VarChar, wheel_size)
      .input('country', sql.VarChar, country)
      .input('category_id', sql.Int, category_id)
      .input('image_url', sql.VarChar, image_url).query(`
        INSERT INTO products (name, description, price, old_price, stock, brand, color, frame_size, wheel_size, country, category_id, image_url)
        VALUES (@name, @description, @price, @old_price, @stock, @brand, @color, @frame_size, @wheel_size, @country, @category_id, @image_url)
      `);

    res.status(201).json({ message: 'Producto creado exitosamente' });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      old_price,
      stock,
      brand,
      color,
      frame_size,
      wheel_size,
      country,
      category_id,
      image_url,
    } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, id)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('price', sql.Decimal(10, 2), price)
      .input('old_price', sql.Decimal(10, 2), old_price)
      .input('stock', sql.Int, stock)
      .input('brand', sql.VarChar, brand)
      .input('color', sql.VarChar, color)
      .input('frame_size', sql.VarChar, frame_size)
      .input('wheel_size', sql.VarChar, wheel_size)
      .input('country', sql.VarChar, country)
      .input('category_id', sql.Int, category_id)
      .input('image_url', sql.VarChar, image_url).query(`
        UPDATE products SET
          name = @name,
          description = @description,
          price = @price,
          old_price = @old_price,
          stock = @stock,
          brand = @brand,
          color = @color,
          frame_size = @frame_size,
          wheel_size = @wheel_size,
          country = @country,
          category_id = @category_id,
          image_url = @image_url,
          updated_at = GETDATE()
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM products WHERE id = @id');

    res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
};
