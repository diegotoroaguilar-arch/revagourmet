const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mesa = sequelize.define('Mesa', {
  numero: { type: DataTypes.INTEGER, allowNull: false },
  capacidad: { type: DataTypes.INTEGER, allowNull: false },
  zona: { type: DataTypes.ENUM('interior', 'terraza', 'ventana', 'VIP'), allowNull: false },
  estado: { type: DataTypes.BOOLEAN, defaultValue: true }
});

module.exports = Mesa;
