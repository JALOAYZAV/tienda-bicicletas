const sql = require('mssql');
require('dotenv').config(); // Carga variables de entorno desde el archivo .env

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

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then((pool) => {
    console.log('✅ Conectado a la base de datos SQL Azure');
    return pool;
  })
  .catch((err) => {
    console.error('❌ Error al conectar a la BD:', err);
  });

module.exports = {
  sql,
  poolPromise,
};
