/**
 * @file userModel.js
 * @description Modelo de datos para operaciones sobre la tabla de usuarios.
 * Provee funciones para consultar usuarios desde la base de datos.
 */

const { poolPromise, sql } = require('../config/db');

/**
 * @function getAllUsers
 * @description Obtiene todos los registros de la tabla 'users'.
 * @returns {Promise<Array>} Lista de usuarios.
 */
async function getAllUsers() {
  const pool = await poolPromise;
  const result = await pool.request().query('SELECT * FROM users');
  return result.recordset;
}

module.exports = {
  getAllUsers,
};
