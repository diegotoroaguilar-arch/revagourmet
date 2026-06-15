const { Op } = require('sequelize');
const { Reserva, Restaurante, Mesa } = require('../models');

exports.estadisticas = async (req, res) => {
  const [totalReservas, reservasActivas, restaurantes, mesasDisponibles] = await Promise.all([
    Reserva.count(),
    Reserva.count({ where: { estado: { [Op.ne]: 'cancelada' } } }),
    Restaurante.count(),
    Mesa.count({ where: { estado: true } })
  ]);

  res.json({ totalReservas, reservasActivas, restaurantes, mesasDisponibles });
};
