const { poolPromise, sql } = require('../config/db');

// Obtener perfil del usuario autenticado
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const pool = await poolPromise;

    const result = await pool.request().input('id', sql.Int, userId).query(`
        SELECT id, name, email, phone_number, profile_picture_url, role_id 
        FROM users 
        WHERE id = @id
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error('Error en getProfile:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Actualizar perfil del usuario autenticado
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, phone_number, profile_picture_url } = req.body;

    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, userId)
      .input('name', sql.VarChar, name)
      .input('phone_number', sql.VarChar, phone_number)
      .input('profile_picture_url', sql.VarChar, profile_picture_url).query(`
        UPDATE users 
        SET name = @name, phone_number = @phone_number, profile_picture_url = @profile_picture_url 
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Obtener todos los usuarios (solo admin)
const getAllUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM users');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAllUsers,
};
