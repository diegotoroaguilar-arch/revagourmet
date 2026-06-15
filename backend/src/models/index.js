const sequelize = require('../config/database');
const Restaurante = require('./Restaurante');
const Sucursal = require('./Sucursal');
const Mesa = require('./Mesa');
const Cliente = require('./Cliente');
const Reserva = require('./Reserva');
const Usuario = require('./Usuario');

Restaurante.hasMany(Sucursal, { foreignKey: 'restauranteId', onDelete: 'CASCADE' });
Sucursal.belongsTo(Restaurante, { foreignKey: 'restauranteId' });

Usuario.hasMany(Restaurante, { foreignKey: 'propietarioId' });
Restaurante.belongsTo(Usuario, { as: 'Propietario', foreignKey: 'propietarioId' });

Sucursal.hasMany(Mesa, { foreignKey: 'sucursalId', onDelete: 'CASCADE' });
Mesa.belongsTo(Sucursal, { foreignKey: 'sucursalId' });

Cliente.hasMany(Reserva, { foreignKey: 'clienteId' });
Reserva.belongsTo(Cliente, { foreignKey: 'clienteId' });

Usuario.hasMany(Reserva, { foreignKey: 'usuarioId' });
Reserva.belongsTo(Usuario, { foreignKey: 'usuarioId' });

Mesa.hasMany(Reserva, { foreignKey: 'mesaId' });
Reserva.belongsTo(Mesa, { foreignKey: 'mesaId' });

module.exports = { sequelize, Restaurante, Sucursal, Mesa, Cliente, Reserva, Usuario };
