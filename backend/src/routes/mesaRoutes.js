const router = require('express').Router();
const controller = require('../controllers/mesaController');
const { autenticar, soloAdmin, soloPropietario } = require('../middlewares/authMiddleware');

router.get('/', controller.listar);
router.get('/disponibles', controller.disponibles);
router.get('/sucursal/:sucursalId', controller.porSucursal);
router.post('/', autenticar, soloPropietario, controller.crear);
router.put('/:id', autenticar, soloPropietario, controller.actualizar);
router.delete('/:id', autenticar, soloPropietario, controller.eliminar);

module.exports = router;
