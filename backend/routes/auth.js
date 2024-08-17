const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController'); // Importa las funciones del controlador

router.post('/login', login);       // Usa la función `login` del controlador
router.post('/register', register); // Usa la función `register` del controlador

module.exports = router;




