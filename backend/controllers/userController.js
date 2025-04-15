const { poolPromise, sql } = require('../config/db');

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

module.exports = { getProfile };
