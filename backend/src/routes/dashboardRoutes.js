const router = require('express').Router();
const controller = require('../controllers/dashboardController');
const { autenticar, soloAdmin } = require('../middlewares/authMiddleware');

router.get('/estadisticas', autenticar, soloAdmin, controller.estadisticas);

module.exports = router;
