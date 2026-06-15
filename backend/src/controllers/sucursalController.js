const { Sucursal, Restaurante, Mesa } = require('../models');

exports.listar = async (req, res) => {
  const sucursales = await Sucursal.findAll({ include: [Restaurante, Mesa], order: [['id', 'ASC']] });
  res.json(sucursales);
};

exports.porRestaurante = async (req, res) => {
  const sucursales = await Sucursal.findAll({
    where: { restauranteId: req.params.restauranteId },
    include: [Restaurante],
    order: [['id', 'ASC']]
  });
  res.json(sucursales);
};

exports.crear = async (req, res) => {
  const restaurante = await Restaurante.findByPk(req.body.restauranteId);
  if (!restaurante) return res.status(400).json({ mensaje: 'El restaurante no existe' });
  const sucursal = await Sucursal.create(req.body);
  res.status(201).json(sucursal);
};

exports.crearPropietario = async (req, res) => {
  const restaurante = await Restaurante.findOne({
    where: { id: req.params.restauranteId, propietarioId: req.usuario.id }
  });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  const sucursal = await Sucursal.create({ ...req.body, restauranteId: restaurante.id, telefono: req.body.telefono || '77591720' });
  res.status(201).json(sucursal);
};

exports.listarPropietario = async (req, res) => {
  const restaurante = await Restaurante.findOne({
    where: { id: req.params.restauranteId, propietarioId: req.usuario.id }
  });
  if (!restaurante) return res.status(404).json({ mensaje: 'Restaurante no encontrado' });
  const sucursales = await Sucursal.findAll({ where: { restauranteId: restaurante.id }, include: [Mesa], order: [['id', 'ASC']] });
  res.json(sucursales);
};

exports.actualizar = async (req, res) => {
  const sucursal = await Sucursal.findByPk(req.params.id);
  if (!sucursal) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
  if (req.usuario?.rol === 'propietario') {
    const restaurante = await Restaurante.findOne({ where: { id: sucursal.restauranteId, propietarioId: req.usuario.id } });
    if (!restaurante) return res.status(403).json({ mensaje: 'No puedes editar sucursales de otro propietario' });
  }
  await sucursal.update(req.body);
  res.json(sucursal);
};

exports.eliminar = async (req, res) => {
  const sucursal = await Sucursal.findByPk(req.params.id);
  if (!sucursal) return res.status(404).json({ mensaje: 'Sucursal no encontrada' });
  if (req.usuario?.rol === 'propietario') {
    const restaurante = await Restaurante.findOne({ where: { id: sucursal.restauranteId, propietarioId: req.usuario.id } });
    if (!restaurante) return res.status(403).json({ mensaje: 'No puedes eliminar sucursales de otro propietario' });
  }
  await sucursal.destroy();
  res.json({ mensaje: 'Sucursal eliminada' });
};
