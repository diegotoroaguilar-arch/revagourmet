require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');
const cargarDatos = require('./seeders/seed');

const PORT = process.env.PORT || 4000;

async function iniciar() {
  await sequelize.sync();
  await cargarDatos();
  app.listen(PORT, () => {
    console.log(`RevaGourmet API lista en http://localhost:${PORT}`);
  });
}

iniciar().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exit(1);
});
