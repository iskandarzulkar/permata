const { Router } = require('express');
const express = require('express');
const router = express.Router()
const bill = require('../app/controller/getBillC');

// module.exports = app => {
router.post('/VirtualAccountH2H/Service/GetBill', bill.getBill);
router.post('/VirtualAccountH2H/Service/PayBill', bill.payBill);
// app.get(`/collection`, verifyToken, controller.findAll);
// }

// router.post('/api/service/authenticate', userC.authenticate)
module.exports = router