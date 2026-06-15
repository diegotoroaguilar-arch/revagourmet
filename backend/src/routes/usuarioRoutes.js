const router = require('express').Router();
const controller = require('../controllers/usuarioController');
const { autenticar, soloAdmin } = require('../middlewares/authMiddleware');

router.use(autenticar, soloAdmin);
router.get('/', controller.listar);
router.get('/:id', controller.obtener);
router.put('/:id', controller.actualizar);
router.delete('/:id', controller.eliminar);

module.exports = router;
