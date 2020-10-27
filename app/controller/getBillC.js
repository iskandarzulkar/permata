const con = require('../../config/db');
var numeral = require('numeral');

const SimpleDateFormat = require('@riversun/simple-date-format');
module.exports = {
    getBill: function async(req, res, next) {
        var dataBill = req.body.GetBillRq;
        // console.log(dataBill)
        var vi = dataBill.VI_VANUMBER;

        let sql = `SELECT * FROM employer WHERE VI_VANUMBER = ?`

        let query = con.query(sql, vi, (err, result) => {
            if (result[0] == null) {
                var data = {
                    "GetBillRs": {
                        "CUSTNAME": "",
                        "BILL_AMOUNT": "0",
                        "VI_CCY": "360",
                        "RefInfo": [
                            {
                                "RefName": "BillPeriod",
                                "RefValue": ""
                            },
                            {
                                "RefName": "BillLateCharges",
                                "RefValue": ""
                            }
                        ],
                        "STATUS": "14"
                    }
                }
                res.send(data)
            } else {
                let status = '00'
                let updateSql = "UPDATE employer SET STATUS='" + status + "'  WHERE VI_VANUMBER='" + vi + "'"
                console.log(updateSql);
                let query = con.query(updateSql, (err, result) => {
                    console.log(result)
                });

                var data = {
                    "GetBillRs": {
                        "CUSTNAME": result[0].CUSTNAME,
                        "BILL_AMOUNT": result[0].BILL_AMOUNT,
                        "VI_CCY": result[0].VI_CCY,
                        "RefInfo": [
                            {
                                "RefName": "BillPeriod",
                                "RefValue": ""
                            },
                            {
                                "RefName": "BillLateCharges",
                                "RefValue": ""
                            }
                        ],
                        "STATUS": result[0].STATUS
                    }
                }
                res.send(data)
            }
        })

    },
    payBill: function async(req, res, next) {
        res.send('next');
    }
}