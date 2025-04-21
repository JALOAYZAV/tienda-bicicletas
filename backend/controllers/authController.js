const { poolPromise, sql } = require('../config/db');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM users');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone_number,
      profile_picture_url,
      role_id,
    } = req.body;

    // Validar datos básicos
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: 'Nombre, email y contraseña son obligatorios' });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const pool = await poolPromise;

    // Verificar si el usuario ya existe
    const existingUser = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    if (existingUser.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: 'Este correo ya está registrado' });
    }

    // Encriptar(Hashear) la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos
    await pool
      .request()
      .input('name', sql.VarChar, name)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('phone_number', sql.VarChar, phone_number)
      .input('profile_picture_url', sql.VarChar, profile_picture_url)
      .input('role_id', sql.Int, role_id || 1).query(`
        INSERT INTO users (name, email, password, phone_number, profile_picture_url, role_id)
        VALUES (@name, @email, @password, @phone_number, @profile_picture_url, @role_id)
      `);

    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error en registro:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await poolPromise;

    // Buscar usuario por email
    const result = await pool
      .request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM users WHERE email = @email');

    const user = result.recordset[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Enviar token
    res.status(200).json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getUsers,
  registerUser,
  loginUser,
};
