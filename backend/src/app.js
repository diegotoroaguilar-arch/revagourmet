const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API RevaGourmet funcionando' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/restaurantes', require('./routes/restauranteRoutes'));
app.use('/api/sucursales', require('./routes/sucursalRoutes'));
app.use('/api/mesas', require('./routes/mesaRoutes'));
app.use('/api/clientes', require('./routes/clienteRoutes'));
app.use('/api/reservas', require('./routes/reservaRoutes'));
app.use('/api/mis-reservas', require('./routes/misReservasRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api', require('./routes/propietarioRoutes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ mensaje: 'Error interno del servidor', detalle: err.message });
});

module.exports = app;
