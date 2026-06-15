const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reserva = sequelize.define('Reserva', {
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.STRING, allowNull: false },
  cantidadPersonas: { type: DataTypes.INTEGER, allowNull: false },
  telefonoContacto: { type: DataTypes.STRING },
  comentarios: { type: DataTypes.TEXT },
  motivoCancelacion: { type: DataTypes.TEXT },
  estado: { type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada'), defaultValue: 'confirmada' }
});

module.exports = Reserva;
