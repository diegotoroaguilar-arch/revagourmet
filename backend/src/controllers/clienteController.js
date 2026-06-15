const { Cliente } = require('../models');

exports.listar = async (req, res) => {
  const clientes = await Cliente.findAll({ order: [['id', 'DESC']] });
  res.json(clientes);
};

exports.crear = async (req, res) => {
  const { nombre, telefono, correo } = req.body;
  if (!nombre || !telefono || !correo) {
    return res.status(400).json({ mensaje: 'Nombre, telefono y correo son obligatorios' });
  }
  const cliente = await Cliente.create({ nombre, telefono, correo });
  res.status(201).json(cliente);
};

exports.actualizar = async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  await cliente.update(req.body);
  res.json(cliente);
};

exports.eliminar = async (req, res) => {
  const cliente = await Cliente.findByPk(req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  await cliente.destroy();
  res.json({ mensaje: 'Cliente eliminado' });
};
