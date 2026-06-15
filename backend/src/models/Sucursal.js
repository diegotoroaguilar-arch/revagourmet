const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sucursal = sequelize.define('Sucursal', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  direccion: { type: DataTypes.STRING, allowNull: false },
  ciudad: { type: DataTypes.STRING, allowNull: false },
  horarioApertura: { type: DataTypes.STRING, allowNull: false },
  horarioCierre: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING, allowNull: false },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Sucursal;
