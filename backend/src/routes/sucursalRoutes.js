const router = require('express').Router();
const controller = require('../controllers/sucursalController');
const { autenticar, soloAdmin, soloPropietario } = require('../middlewares/authMiddleware');

router.get('/', controller.listar);
router.get('/restaurante/:restauranteId', controller.porRestaurante);
router.post('/', autenticar, soloAdmin, controller.crear);
router.put('/:id', autenticar, soloPropietario, controller.actualizar);
router.delete('/:id', autenticar, soloPropietario, controller.eliminar);

module.exports = router;
