/**
 * @file db.js
 * @description Configuración de conexión a la base de datos SQL Server para el backend de CRETO.
 * Utiliza variables de entorno desde .env y establece un pool de conexiones con MSSQL.
 */

const sql = require('mssql');
require('dotenv').config(); // Carga variables de entorno desde el archivo .env

/**
 * @constant {Object} config
 * @description Configuración para la conexión a SQL Server.
 * Los valores se obtienen del archivo .env.
 */
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true, // Necesario para conexiones seguras en Azure
    trustServerCertificate: true, // True solo en desarrollo. En producción: false.
  },
  pool: {
    max: 10, // Máximo de conexiones en el pool
    min: 0, // Mínimo de conexiones
    idleTimeoutMillis: 30000, // Tiempo antes de cerrar conexión inactiva
  },
};

/**
 * @constant {Promise<sql.ConnectionPool>} poolPromise
 * @description Promesa que representa la conexión con la base de datos.
 * Es reutilizada en todo el proyecto para evitar múltiples conexiones abiertas.
 */
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('✅ Conectado a la base de datos SQL Azure');
    return pool;
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la BD:', err);
  });

/**
 * Exporta el objeto sql y la promesa de conexión poolPromise
 * @module db
 */
module.exports = {
  sql,
  poolPromise,
};
