const { poolPromise, sql } = require('../config/db');

const getCategories = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM categories');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image_url } = req.body;
    const pool = await poolPromise;
    await pool
      .request()
      .input('name', sql.VarChar, name)
      .input('description', sql.VarChar, description)
      .input('image_url', sql.VarChar, image_url)
      .query(
        'INSERT INTO categories (name, description, image_url) VALUES (@name, @description, @image_url)'
      );
    res.status(201).json({ message: 'Categoría creada exitosamente' });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getCategories,
  createCategory,
};
