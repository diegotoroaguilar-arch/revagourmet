const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

const atributosPublicos = ['id', 'nombre', 'correo', 'rol', 'createdAt', 'updatedAt'];

exports.listar = async (req, res) => {
  const usuarios = await Usuario.findAll({ attributes: atributosPublicos, order: [['id', 'ASC']] });
  res.json(usuarios);
};

exports.obtener = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id, { attributes: atributosPublicos });
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
};

exports.actualizar = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const datos = { ...req.body };
  if (datos.password) datos.password = await bcrypt.hash(datos.password, 10);
  await usuario.update(datos);

  const actualizado = await Usuario.findByPk(usuario.id, { attributes: atributosPublicos });
  res.json(actualizado);
};

exports.eliminar = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  await usuario.destroy();
  res.json({ mensaje: 'Usuario eliminado' });
};
