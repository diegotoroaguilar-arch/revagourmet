const router = require('express').Router();
const controller = require('../controllers/authController');
const { autenticar } = require('../middlewares/authMiddleware');

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/perfil', autenticar, controller.perfil);

module.exports = router;
