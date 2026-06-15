const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'revagourmet_secreto_demo';

async function autenticar(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ mensaje: 'Token no enviado' });

    const payload = jwt.verify(token, JWT_SECRET);
    const usuario = await Usuario.findByPk(payload.id, {
      attributes: ['id', 'nombre', 'correo', 'rol']
    });
    if (!usuario) return res.status(401).json({ mensaje: 'Usuario no encontrado' });

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Sesion invalida o expirada' });
  }
}

function soloAdmin(req, res, next) {
  if (req.usuario?.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso exclusivo para administradores' });
  }
  next();
}

function soloPropietario(req, res, next) {
  if (!['propietario', 'admin'].includes(req.usuario?.rol)) {
    return res.status(403).json({ mensaje: 'Acceso exclusivo para propietarios' });
  }
  next();
}

module.exports = { autenticar, soloAdmin, soloPropietario, JWT_SECRET };
