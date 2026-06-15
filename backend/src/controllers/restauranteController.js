const { Op } = require('sequelize');
const { Restaurante, Sucursal, Mesa, Reserva, Cliente, Usuario } = require('../models');

exports.listar = async (req, res) => {
  const restaurantes = await Restaurante.findAll({ where: { estado: 'aprobado' }, include: Sucursal, order: [['id', 'ASC']] });
  res.json(restaurantes);
};

exports.obtener = async (req, res) => {
  const restaurante = await Restaurante.findByPk(req.params.id, { include: Sucursal });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  res.json(restaurante);
};

exports.crear = async (req, res) => {
  const restaurante = await Restaurante.create({ ...req.body, estado: req.body.estado || 'aprobado' });
  res.status(201).json(restaurante);
};

exports.registrar = async (req, res) => {
  if (!['propietario', 'admin'].includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'Debes registrarte como propietario' });
  }
  const restaurante = await Restaurante.create({
    ...req.body,
    propietarioId: req.usuario.id,
    estado: 'pendiente'
  });
  res.status(201).json(restaurante);
};

exports.misRestaurantes = async (req, res) => {
  const restaurantes = await Restaurante.findAll({
    where: { propietarioId: req.usuario.id },
    include: [{ model: Sucursal, include: [Mesa] }],
    order: [['id', 'DESC']]
  });
  res.json(restaurantes);
};

exports.miRestaurante = async (req, res) => {
  const restaurante = await Restaurante.findOne({
    where: { id: req.params.id, propietarioId: req.usuario.id },
    include: [{ model: Sucursal, include: [Mesa] }]
  });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  res.json(restaurante);
};

exports.actualizarMio = async (req, res) => {
  const restaurante = await Restaurante.findOne({ where: { id: req.params.id, propietarioId: req.usuario.id } });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  await restaurante.update({ ...req.body, estado: req.body.estado || restaurante.estado });
  res.json(restaurante);
};

exports.eliminarMio = async (req, res) => {
  const restaurante = await Restaurante.findOne({ where: { id: req.params.id, propietarioId: req.usuario.id } });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  await restaurante.destroy();
  res.json({ mensaje: 'Restaurante eliminado' });
};

exports.pendientes = async (req, res) => {
  const restaurantes = await Restaurante.findAll({ where: { estado: 'pendiente' }, include: Sucursal, order: [['id', 'DESC']] });
  res.json(restaurantes);
};

exports.aprobar = async (req, res) => {
  const restaurante = await Restaurante.findByPk(req.params.id);
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  await restaurante.update({ estado: 'aprobado' });
  res.json(restaurante);
};

exports.rechazar = async (req, res) => {
  const restaurante = await Restaurante.findByPk(req.params.id);
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  await restaurante.update({ estado: 'rechazado' });
  res.json(restaurante);
};

exports.reservasPropietario = async (req, res) => {
  const restaurantes = await Restaurante.findAll({ where: { propietarioId: req.usuario.id }, attributes: ['id'] });
  const ids = restaurantes.map((r) => r.id);
  const reservas = await Reserva.findAll({
    include: [Cliente, Usuario, { model: Mesa, include: [{ model: Sucursal, where: { restauranteId: { [Op.in]: ids } }, include: [Restaurante] }] }],
    order: [['createdAt', 'DESC']]
  });
  res.json(reservas);
};

exports.reservasPorRestaurante = async (req, res) => {
  const restaurante = await Restaurante.findOne({ where: { id: req.params.restauranteId, propietarioId: req.usuario.id } });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  const reservas = await Reserva.findAll({
    include: [Cliente, Usuario, { model: Mesa, include: [{ model: Sucursal, where: { restauranteId: restaurante.id }, include: [Restaurante] }] }],
    order: [['createdAt', 'DESC']]
  });
  res.json(reservas);
};

exports.actualizar = async (req, res) => {
  const restaurante = await Restaurante.findByPk(req.params.id);
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  await restaurante.update(req.body);
  res.json(restaurante);
};

exports.eliminar = async (req, res) => {
  const restaurante = await Restaurante.findByPk(req.params.id);
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  await restaurante.destroy();
  res.json({ mensaje: 'Restaurante eliminado' });
};
