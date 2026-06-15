const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Restaurante = sequelize.define('Restaurante', {
  nombre: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT, allowNull: false },
  tipoComida: { type: DataTypes.STRING, allowNull: false },
  rangoPrecio: { type: DataTypes.STRING, allowNull: false },
  imagen: { type: DataTypes.STRING, allowNull: false },
  telefonoContacto: { type: DataTypes.STRING, defaultValue: '77591720' },
  correoContacto: { type: DataTypes.STRING },
  nit: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, defaultValue: 'aprobado', validate: { isIn: [['pendiente', 'aprobado', 'rechazado']] } }
});

module.exports = Restaurante;
