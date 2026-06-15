const router = require('express').Router();
const restauranteController = require('../controllers/restauranteController');
const sucursalController = require('../controllers/sucursalController');
const mesaController = require('../controllers/mesaController');
const { autenticar, soloPropietario } = require('../middlewares/authMiddleware');

router.use(autenticar, soloPropietario);

router.get('/mis-restaurantes', restauranteController.misRestaurantes);
router.get('/mis-restaurantes/:id', restauranteController.miRestaurante);
router.put('/mis-restaurantes/:id', restauranteController.actualizarMio);
router.delete('/mis-restaurantes/:id', restauranteController.eliminarMio);
router.post('/mis-restaurantes/:restauranteId/sucursales', sucursalController.crearPropietario);
router.get('/mis-restaurantes/:restauranteId/sucursales', sucursalController.listarPropietario);
router.post('/sucursales/:sucursalId/mesas', mesaController.crearPropietario);
router.get('/propietario/reservas', restauranteController.reservasPropietario);
router.get('/propietario/reservas/restaurante/:restauranteId', restauranteController.reservasPorRestaurante);

module.exports = router;
