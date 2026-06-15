const router = require('express').Router();
const controller = require('../controllers/restauranteController');
const { autenticar, soloAdmin, soloPropietario } = require('../middlewares/authMiddleware');

router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/registrar', autenticar, soloPropietario, controller.registrar);
router.post('/', autenticar, soloAdmin, controller.crear);
router.put('/:id', autenticar, soloAdmin, controller.actualizar);
router.delete('/:id', autenticar, soloAdmin, controller.eliminar);

module.exports = router;
