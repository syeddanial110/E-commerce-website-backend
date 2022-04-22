const express = require('express');
const { signup, login, fetchUsers } = require('../controller/authController');
const router = express.Router();

router.get('/', fetchUsers);
router.post("/signup" , signup)
router.post('/login', login);


module.exports = router