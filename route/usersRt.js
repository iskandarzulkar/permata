const { Router } = require('express');
const express = require('express');
const router = express.Router()
const userC = require('../app/controller/usersC');

router.post('/api/service/resgiter', userC.create);
router.post('/api/service/authenticate', userC.authenticate)
module.exports = router