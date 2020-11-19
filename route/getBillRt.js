const { Router } = require('express');
const express = require('express');
const router = express.Router()
const bill = require('../app/controller/getBillC');
const rateLimit = require("express-rate-limit");

// const limiter = rateLimit({
//     windowMs: 5 * 60 * 1000, // 5 minutes
//     max: 3 // limit each IP to 100 requests per windowMs
// });


// module.exports = app => {
router.post('/VirtualAccountH2H/Service/getEmployer', bill.getEmployer);
router.post('/VirtualAccountH2H/Service/SaveEmployer', bill.saveEmployer);
router.post('/VirtualAccountH2H/Service/GetBill', bill.getBill);
router.post('/VirtualAccountH2H/Service/PayBill', bill.payBill);
router.post('/VirtualAccountH2H/Service/ReservalBill', bill.reversalBill);


// router.post('/api/service/authenticate', userC.authenticate)
module.exports = router