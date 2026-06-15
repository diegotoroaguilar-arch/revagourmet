const router = require('express').Router();
const controller = require('../controllers/reservaController');
const { autenticar } = require('../middlewares/authMiddleware');

router.use(autenticar);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.post('/', controller.crear);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);
router.put('/:id/cancelar', controller.cancelar);

module.exports = router;
