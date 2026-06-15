const router = require('express').Router();
const controller = require('../controllers/reservaController');
const { autenticar } = require('../middlewares/authMiddleware');

router.get('/', autenticar, controller.misReservas);

module.exports = router;
