const { Op } = require('sequelize');
const { Reserva, Cliente, Mesa, Sucursal, Restaurante, Usuario } = require('../models');
const { enviarCorreoReserva } = require('../services/emailService');

const incluirDetalle = [
  Cliente,
  { model: Usuario, attributes: ['id', 'nombre', 'correo', 'rol'] },
  {
    model: Mesa,
    include: [{ model: Sucursal, include: [Restaurante] }]
  }
];

function fechaPasada(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(`${fecha}T00:00:00`) < hoy;
}

exports.listar = async (req, res) => {
  const where = req.usuario?.rol === 'admin' ? {} : { usuarioId: req.usuario.id };
  const reservas = await Reserva.findAll({ where, include: incluirDetalle, order: [['createdAt', 'DESC']] });
  res.json(reservas);
};

exports.misReservas = async (req, res) => {
  const reservas = await Reserva.findAll({
    where: { usuarioId: req.usuario.id },
    include: incluirDetalle,
    order: [['createdAt', 'DESC']]
  });
  res.json(reservas);
};

exports.obtener = async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id, { include: incluirDetalle });
  if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  if (req.usuario.rol !== 'admin' && reserva.usuarioId !== req.usuario.id) {
    return res.status(403).json({ mensaje: 'No puedes ver reservas de otros usuarios' });
  }
  res.json(reserva);
};

exports.crear = async (req, res) => {
  const { mesaId, fecha, hora, cantidadPersonas, telefonoContacto, comentarios } = req.body;

  if (!mesaId || !fecha || !hora || !cantidadPersonas || !telefonoContacto) {
    return res.status(400).json({ mensaje: 'Mesa, fecha, hora, personas y telefono son obligatorios' });
  }
  if (fechaPasada(fecha)) {
    return res.status(400).json({ mensaje: 'No se permiten reservas con fecha pasada' });
  }

  const mesa = await Mesa.findByPk(mesaId, { include: Sucursal });
  if (!mesa || !mesa.Sucursal) return res.status(400).json({ mensaje: 'La mesa o sucursal no existe' });
  if (!mesa.estado) return res.status(400).json({ mensaje: 'La mesa esta inactiva' });
  if (Number(cantidadPersonas) > mesa.capacidad) {
    return res.status(400).json({ mensaje: 'La cantidad de personas supera la capacidad de la mesa' });
  }

  const reservaExistente = await Reserva.findOne({
    where: { mesaId, fecha, hora, estado: { [Op.ne]: 'cancelada' } }
  });
  if (reservaExistente) {
    return res.status(409).json({ mensaje: 'La mesa ya esta ocupada en esa fecha y hora' });
  }

  const [clienteGuardado] = await Cliente.findOrCreate({
    where: { correo: req.usuario.correo },
    defaults: { nombre: req.usuario.nombre, telefono: telefonoContacto, correo: req.usuario.correo }
  });
  await clienteGuardado.update({ nombre: req.usuario.nombre, telefono: telefonoContacto, correo: req.usuario.correo });

  const reserva = await Reserva.create({
    usuarioId: req.usuario.id,
    clienteId: clienteGuardado.id,
    mesaId,
    fecha,
    hora,
    cantidadPersonas,
    telefonoContacto,
    comentarios,
    estado: 'confirmada'
  });

  const completa = await Reserva.findByPk(reserva.id, { include: incluirDetalle });
  enviarCorreoReserva(completa).catch((error) => {
    console.error('No se pudo enviar el correo de reserva:', error.message);
  });
  res.status(201).json(completa);
};

exports.actualizar = async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id);
  if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  if (req.usuario.rol !== 'admin' && reserva.usuarioId !== req.usuario.id) {
    return res.status(403).json({ mensaje: 'No puedes modificar reservas de otros usuarios' });
  }
  if (req.body.estado && !['pendiente', 'confirmada', 'cancelada'].includes(req.body.estado)) {
    return res.status(400).json({ mensaje: 'Estado de reserva invalido' });
  }
  await reserva.update(req.body);
  res.json(await Reserva.findByPk(reserva.id, { include: incluirDetalle }));
};

exports.eliminar = async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id);
  if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  if (req.usuario.rol !== 'admin' && reserva.usuarioId !== req.usuario.id) {
    return res.status(403).json({ mensaje: 'No puedes eliminar reservas de otros usuarios' });
  }
  await reserva.destroy();
  res.json({ mensaje: 'Reserva eliminada' });
};

exports.cancelar = async (req, res) => {
  const reserva = await Reserva.findByPk(req.params.id);
  if (!reserva) return res.status(404).json({ mensaje: 'Reserva no encontrada' });
  if (req.usuario.rol !== 'admin' && reserva.usuarioId !== req.usuario.id) {
    return res.status(403).json({ mensaje: 'No puedes cancelar reservas de otros usuarios' });
  }
  const { motivoCancelacion } = req.body;
  if (!motivoCancelacion || motivoCancelacion.trim().length < 5) {
    return res.status(400).json({ mensaje: 'Indica un motivo de cancelacion de al menos 5 caracteres' });
  }
  await reserva.update({ estado: 'cancelada', motivoCancelacion: motivoCancelacion.trim() });
  res.json(await Reserva.findByPk(reserva.id, { include: incluirDetalle }));
};
