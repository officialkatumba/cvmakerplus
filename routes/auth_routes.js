const express = require('express');
const authController = require('../controllers/auth_controller');
const { redirectIfAuthenticated } = require('../middlewares/auth_middleware');

const router = express.Router();

router.get('/login', redirectIfAuthenticated, authController.showLogin);
router.post('/login', redirectIfAuthenticated, authController.login);
router.get('/register', redirectIfAuthenticated, authController.showRegister);
router.post('/register', redirectIfAuthenticated, authController.register);
router.post('/logout', authController.logout);

module.exports = router;
