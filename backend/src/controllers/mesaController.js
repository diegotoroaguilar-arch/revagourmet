const { Op } = require('sequelize');
const { Mesa, Sucursal, Reserva, Restaurante } = require('../models');

exports.listar = async (req, res) => {
  const mesas = await Mesa.findAll({ include: Sucursal, order: [['sucursalId', 'ASC'], ['numero', 'ASC']] });
  res.json(mesas);
};

exports.porSucursal = async (req, res) => {
  const mesas = await Mesa.findAll({
    where: { sucursalId: req.params.sucursalId },
    order: [['numero', 'ASC']]
  });
  res.json(mesas);
};

exports.disponibles = async (req, res) => {
  const { sucursalId, fecha, hora, personas } = req.query;
  if (!sucursalId || !fecha || !hora || !personas) {
    return res.status(400).json({ mensaje: 'sucursalId, fecha, hora y personas son obligatorios' });
  }

  const ocupadas = await Reserva.findAll({
    where: { fecha, hora, estado: { [Op.ne]: 'cancelada' } },
    attributes: ['mesaId']
  });
  const idsOcupadas = ocupadas.map((reserva) => reserva.mesaId);

  const mesas = await Mesa.findAll({
    where: {
      sucursalId,
      estado: true,
      capacidad: { [Op.gte]: Number(personas) },
      id: { [Op.notIn]: idsOcupadas.length ? idsOcupadas : [0] }
    },
    order: [['numero', 'ASC']]
  });

  res.json(mesas);
};

exports.crear = async (req, res) => {
  const sucursal = await Sucursal.findByPk(req.body.sucursalId);
  if (!sucursal) return res.status(400).json({ mensaje: 'La sucursal no existe' });
  if (req.usuario?.rol === 'propietario') {
    const restaurante = await Restaurante.findOne({ where: { id: sucursal.restauranteId, propietarioId: req.usuario.id } });
    if (!restaurante) return res.status(403).json({ mensaje: 'No puedes crear mesas en otra sucursal' });
  }
  const mesa = await Mesa.create(req.body);
  res.status(201).json(mesa);
};

exports.crearPropietario = async (req, res) => {
  const sucursal = await Sucursal.findByPk(req.params.sucursalId);
  if (!sucursal) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
  const restaurante = await Restaurante.findOne({ where: { id: sucursal.restauranteId, propietarioId: req.usuario.id } });
  if (!restaurante) return res.status(403).json({ mensaje: 'No puedes crear mesas en otra sucursal' });
  const mesa = await Mesa.create({ ...req.body, sucursalId: sucursal.id });
  res.status(201).json(mesa);
};

exports.actualizar = async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id, { include: Sucursal });
  if (!mesa) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
  if (req.usuario?.rol === 'propietario') {
    const restaurante = await Restaurante.findOne({ where: { id: mesa.Sucursal.restauranteId, propietarioId: req.usuario.id } });
    if (!restaurante) return res.status(403).json({ mensaje: 'No puedes editar mesas de otro propietario' });
  }
  await mesa.update(req.body);
  res.json(mesa);
};

exports.eliminar = async (req, res) => {
  const mesa = await Mesa.findByPk(req.params.id, { include: Sucursal });
  if (!mesa) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
  if (req.usuario?.rol === 'propietario') {
    const restaurante = await Restaurante.findOne({ where: { id: mesa.Sucursal.restauranteId, propietarioId: req.usuario.id } });
    if (!restaurante) return res.status(403).json({ mensaje: 'No puedes eliminar mesas de otro propietario' });
  }
  await mesa.destroy();
  res.json({ mensaje: 'Mesa eliminada' });
};
