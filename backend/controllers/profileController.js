const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcryptjs');

const getProfile = (req, res) => {
  res.status(200).json({
    message: 'Perfil del usuario autenticado',
    user: req.user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone_number, profile_picture_url } = req.body;
    const userId = req.user.userId;
    const pool = await poolPromise;

    await pool
      .request()
      .input('id', sql.Int, userId)
      .input('name', sql.VarChar, name)
      .input('phone_number', sql.VarChar, phone_number)
      .input('profile_picture_url', sql.VarChar, profile_picture_url).query(`
        UPDATE users SET
          name = @name,
          phone_number = @phone_number,
          profile_picture_url = @profile_picture_url
        WHERE id = @id
      `);

    res.status(200).json({ message: 'Perfil actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input('id', sql.Int, userId)
      .query('SELECT password FROM users WHERE id = @id');

    const user = result.recordset[0];
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña actual incorrecta' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool
      .request()
      .input('id', sql.Int, userId)
      .input('password', sql.VarChar, hashedPassword)
      .query('UPDATE users SET password = @password WHERE id = @id');

    res.status(200).json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
