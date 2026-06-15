const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const { JWT_SECRET } = require('../middlewares/authMiddleware');

function generarToken(usuario) {
  return jwt.sign({ id: usuario.id, rol: usuario.rol }, JWT_SECRET, { expiresIn: '8h' });
}

function publico(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
}

exports.register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: 'Nombre, correo y password son obligatorios' });
  }
  if (password.length < 6) {
    return res.status(400).json({ mensaje: 'La contrasena debe tener minimo 6 caracteres' });
  }

  const existente = await Usuario.findOne({ where: { correo } });
  if (existente) return res.status(409).json({ mensaje: 'Ese correo ya esta registrado' });

  const hash = await bcrypt.hash(password, 10);
  const rolSeguro = rol === 'propietario' ? 'propietario' : 'usuario';
  const usuario = await Usuario.create({ nombre, correo, password: hash, rol: rolSeguro });
  res.status(201).json({ usuario: publico(usuario), token: generarToken(usuario) });
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) return res.status(400).json({ mensaje: 'Correo y password son obligatorios' });

  const usuario = await Usuario.findOne({ where: { correo } });
  if (!usuario) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

  const ok = await bcrypt.compare(password, usuario.password);
  if (!ok) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

  res.json({ usuario: publico(usuario), token: generarToken(usuario) });
};

exports.perfil = async (req, res) => {
  res.json({ usuario: req.usuario });
};
