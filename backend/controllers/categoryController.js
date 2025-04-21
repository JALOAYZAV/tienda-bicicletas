const { poolPromise, sql } = require('../config/db');

// Obtener todas las categorías (público)
const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM categories');
    res.status(200).json({ success: true, data: result.recordset });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Obtener categoría por ID
const getCategoryById = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input('id', sql.Int, categoryId)
      .query('SELECT * FROM categories WHERE id = @id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.status(200).json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error('Error al obtener categoría:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Crear categoría (solo admin)
const createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Nombre es obligatorio' });
    }

    const pool = await poolPromise;
    await pool
      .request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description || null)
      .input('image_url', sql.VarChar, image_url || null)
      .query(
        'INSERT INTO categories (name, description, image_url) VALUES (@name, @description, @image_url)'
      );

    res
      .status(201)
      .json({ success: true, message: 'Categoría creada correctamente' });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Actualizar categoría (solo admin)
const updateCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const { name, description, image_url } = req.body;
    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, categoryId)
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description || null)
      .input('image_url', sql.VarChar, image_url || null)
      .query(
        'UPDATE categories SET name = @name, description = @description, image_url = @image_url WHERE id = @id'
      );

    res
      .status(200)
      .json({ success: true, message: 'Categoría actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

// Eliminar categoría (solo admin)
const deleteCategory = async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);
    const pool = await poolPromise;

    // ✅ Validación agregada: impedir eliminar categoría con productos asociados
    const result = await pool
      .request()
      .input('id', sql.Int, categoryId)
      .query('SELECT COUNT(*) AS count FROM products WHERE category_id = @id');

    if (result.recordset[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          'No se puede eliminar la categoría. Tiene productos asociados.',
      });
    }

    // Eliminación de la categoría
    await pool
      .request()
      .input('id', sql.Int, categoryId)
      .query('DELETE FROM categories WHERE id = @id');

    res
      .status(200)
      .json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ success: false, message: 'Error del servidor' });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
