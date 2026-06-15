const router = require('express').Router();
const restauranteController = require('../controllers/restauranteController');
const { autenticar, soloAdmin } = require('../middlewares/authMiddleware');

router.use(autenticar, soloAdmin);

router.get('/restaurantes-pendientes', restauranteController.pendientes);
router.put('/restaurantes/:id/aprobar', restauranteController.aprobar);
router.put('/restaurantes/:id/rechazar', restauranteController.rechazar);

module.exports = router;
