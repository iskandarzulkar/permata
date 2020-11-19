const con = require('../../config/db');
var numeral = require('numeral');


const SimpleDateFormat = require('@riversun/simple-date-format');
const { compareSync } = require('bcrypt');
module.exports = {
    getBill: function async(req, res) {
        try {
            const data = req.body;
            const dataGetBillRq = req.body.GetBillRq;

            const billRq = {
                INSTCODE, VI_VANUMBER, VI_TRACENO, VI_TRNDATE, VI_DELCHANNEL
            } = dataGetBillRq;

            //check format json request 
            if (Object.keys(data) == 'GetBillRq') {
                let vi = billRq.VI_VANUMBER

                //check vi_number in employer
                let sql = `SELECT * FROM employer WHERE VI_VANUMBER = ?`
                let query = con.query(sql, vi, (err, dataEmploy) => {
                    // console.log(dataEmploy)

                    if (dataEmploy[0] == null) {

                        //response json VI_VANUMBER NOT FOUND IN DATABASE
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
                        let vi = billRq.VI_VANUMBER
                        let date = billRq.VI_TRNDATE
                        let trnd = date.substring(0, 10);
                        console.log(vi)

                        let chkInGetBill = 'SELECT * FROM getbillrq WHERE VI_VANUMBER = ?'
                        let queryChkGetBill = con.query(chkInGetBill, vi, (err, rst) => {

                            //NOT FOUN 
                            if (rst[0] == null) {
                                //CHECK VI_TRACENO
                                let viTrackno = billRq.VI_TRACENO;

                                let statusBill = "00";
                                //save request to db getBill
                                let saveGetBill1 = { INSTCODE: billRq.INSTCODE, VI_VANUMBER: billRq.VI_VANUMBER, VI_TRACENO: billRq.VI_TRACENO, VI_TRNDATE: billRq.VI_TRNDATE, VI_DELCHANNEL: billRq.VI_DELCHANNEL, STATUS: statusBill };
                                let sqlSave1 = "INSERT INTO getbillrq SET ?"

                                let querySaveGetBill1 = con.query(sqlSave1, saveGetBill1, (err, rstGetBill1) => {
                                    var data = {
                                        "GetBillRs": {
                                            "CUSTNAME": dataEmploy[0].CUSTNAME,
                                            "BILL_AMOUNT": dataEmploy[0].BILL_AMOUNT,
                                            "VI_CCY": dataEmploy[0].VI_CCY,
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
                                            "STATUS": statusBill
                                        }
                                    }
                                    res.send(data)
                                })

                            } else {

                                //CHECK IF VI_NUMBER IS FOUNDED IN GETBILLRQ
                                let vi = billRq.VI_VANUMBER
                                let date = billRq.VI_TRNDATE
                                let trnd = date.substring(0, 10);

                                let chkInGetBill1 = `SELECT * FROM getbillrq WHERE VI_VANUMBER=${vi} AND VI_TRNDATE  LIKE '${trnd}%'`
                                console.log(chkInGetBill1)
                                let queryChkGetBill1 = con.query(chkInGetBill1, (err, rst) => {
                                    if (rst[0] != null) {
                                        let statusBill = "00";
                                        var data = {
                                            "GetBillRs": {
                                                "CUSTNAME": dataEmploy[0].CUSTNAME,
                                                "BILL_AMOUNT": dataEmploy[0].BILL_AMOUNT,
                                                "VI_CCY": dataEmploy[0].VI_CCY,
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
                                                "STATUS": statusBill
                                            }
                                        }
                                        res.send(data)
                                    } else {
                                        let statusBill = "00";
                                        //save request to db getBill
                                        let saveGetBill = { INSTCODE: billRq.INSTCODE, VI_VANUMBER: billRq.VI_VANUMBER, VI_TRACENO: billRq.VI_TRACENO, VI_TRNDATE: billRq.VI_TRNDATE, VI_DELCHANNEL: billRq.VI_DELCHANNEL, STATUS: statusBill };

                                        let sqlSave = "INSERT INTO getbillrq SET ?"

                                        let querySave = con.query(sqlSave, saveGetBill, (err, saveBill) => {
                                            // console.log(saveBill)
                                            var data = {
                                                "GetBillRs": {
                                                    "CUSTNAME": dataEmploy[0].CUSTNAME,
                                                    "BILL_AMOUNT": dataEmploy[0].BILL_AMOUNT,
                                                    "VI_CCY": dataEmploy[0].VI_CCY,
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
                                                    "STATUS": statusBill
                                                }
                                            }
                                            res.send(data)
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        } catch (err) {
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
                    "STATUS": "66"
                }
            }
            res.send(data)
        }
    },
    payBill: function async(req, res) {
        try {
            const data = req.body;
            const dataPayBills = req.body.PayBillRq;

            const payBill = {
                INSTCODE, VI_VANUMBER, VI_TRACENO, VI_TRNDATE, VI_DELCHANNEL, BILL_AMOUNT, VI_CCY, VI_DELCHANNEL
            } = dataPayBills

            if (Object.keys(data) == 'PayBillRq') {
                let vi = payBill.VI_VANUMBER;
                let tracNo = payBill.VI_TRACENO;
                console.log(vi)
                console.log(tracNo);
                let sqlBillRq = `SELECT * FROM employer INNER JOIN getbillrq on employer.VI_VANUMBER = getbillrq.VI_VANUMBER WHERE employer.VI_VANUMBER=${vi} AND getbillrq.VI_TRACENO=${tracNo}`;
                // let sqlBillRq = `SELECT * FROM employer INNER JOIN getbillrq on employer.VI_VANUMBER getbillrq.VI_VANUMBER WHERE employer.VI_VANUMBER=${vi} AND getbillrq.VI_TRACENO=${tracNo}`;
                // console.log(sqlBillRqa);
                let queryBillRq = con.query(sqlBillRq, (err, rst) => {
                    if (err) throw err;
                    console.log(rst)

                    if (rst[0] == null) {
                        var data = { "PayBillRs": { "STATUS": "66" } }
                        res.send(data)
                    } else if (rst[0] != null) {
                        //CHECK DATA DI PAYBILL APAKAH PAYBILL DENGAN SEKAIN DAN VI_TRACENO SEKIAN SUDAH ADA
                        let SqlCb = `SELECT * FROM paybill WHERE VI_VANUMBER=${payBill.VI_VANUMBER} AND VI_TRACENO=${payBill.VI_TRACENO}`;
                        console.log(SqlCb);
                        let sqlCheckBill = con.query(SqlCb, (err, rstBi) => {
                            console.log(rstBi)
                            if (rstBi[0] != null) {
                                var data = { "PayBillRs": { "STATUS": "88" } }
                                res.send(data)
                            } else if (rstBi[0] == null) {
                                let statusBill = "00"
                                let savePayBill = { INSTCODE: payBill.INSTCODE, VI_VANUMBER: payBill.VI_VANUMBER, VI_TRACENO: payBill.VI_TRACENO, VI_TRNDATE: payBill.VI_TRNDATE, BILL_AMOUNT: payBill.BILL_AMOUNT, VI_CCY: payBill.VI_CCY, VI_DELCHANNEL: payBill.VI_DELCHANNEL, STATUS: statusBill };
                                let sqlSaveBill = "INSERT INTO paybill SET ?"
                                let querySaveBill = con.query(sqlSaveBill, savePayBill, (err, rst) => {
                                    console.log(rst)
                                    var data = { "PayBillRs": { "STATUS": "00" } }
                                    res.send(data)
                                })
                            }
                        })


                    }
                })
            }
        } catch (err) {
            var data = { "PayBillRs": { "STATUS": "66" } }
            res.send(data)
        }
    },
    reversalBill: function async(req, res) {
        try {
            const reqData = req.body
            const reqBill = req.body.RevBillRq

            if (Object.keys(reqData) == 'RevBillRq') {
                const status = "00";

                const dataReq = {
                    INSTCODE, VI_VANUMBER, VI_TRACENO, VI_TRNDATE, VI_DELCHANNEL, BILL_AMOUNT, VI_CCY, VI_DELCHANNEL
                } = reqBill;

                let sqlRevBill = `SELECT * FROM employer INNER JOIN getbillrq on employer.VI_VANUMBER = getbillrq.VI_VANUMBER WHERE employer.VI_VANUMBER=${reqBill.VI_VANUMBER} AND getbillrq.VI_TRACENO=${reqBill.VI_TRACENO}`
                let queryRevBill = con.query(sqlRevBill, (err, rsts) => {
                    // console.log(rsts)
                    if (rsts[0] != null) {
                        // if (err) throw err;
                        let status = "00";
                        let dataQuery = {
                            INSTCODE: reqBill.INSTCODE, VI_VANUMBER: reqBill.VI_VANUMBER, VI_TRACENO: reqBill.VI_TRACENO, VI_TRNDATE: reqBill.VI_TRNDATE, VI_DELCHANNEL: reqBill.VI_DELCHANNEL, BILL_AMOUNT: reqBill.BILL_AMOUNT, VI_CCY: reqBill.VI_CCY, VI_DELCHANNEL: reqBill.VI_DELCHANNEL, STATUS: status
                        }
                        let sqlSvRvBll = "INSERT INTO rebillrs SET ?"
                        let querySvRvBll = con.query(sqlSvRvBll, dataQuery, (err, rst) => {
                            // console.log(rst)
                            if (err) throw err;
                            res.json({ "RevBillRs": { "STATUS": "00" } })
                        })
                        // let querySvRvBll = con.query(sqlSvRvBll, dataQuery, (err, rst) => {
                        //     // if (err) throw err;
                        //     data = { "RevBillRs": { "STATUS": "00" } }
                        // })
                    } else if (rsts[0] == null) {
                        res.json({ "PayBillRs": { "STATUS": "14" } })
                    }
                })
            } else {
                res.json({ "PayBillRs": { "STATUS": "66" } })
            }
        } catch (err) {
            res.json({ "PayBillRs": { "STATUS": "66" } })
        }
    },
    getEmployer: function async(req, res) {



        let sql = "SELECT * FROM employer";

        let query = con.query(sql, (err, results) => {
            if (err) throw err;
            res.json({ results })
        });
    },
    saveEmployer: function async(req, res) {
        try {

            let sqlSelectPackageId = "SELECT MAX(VI_VANUMBER) AS max_vi FROM employer";

            con.query(sqlSelectPackageId, (err, rst) => {
                if (err) throw err;

                crt = rst[0].max_vi;
                var vi = crt.substring(0, 4);
                var str = crt.substring(4, 20);
                var jml = ++str;

                var newVI = vi + jml
                console.log(newVI)

                let data = { VI_VANUMBER: newVI, CUSTNAME: req.body.CUSTNAME, BILL_AMOUNT: req.body.BILL_AMOUNT, VI_CCY: req.body.VI_CCY }
                let sql = "INSERT INTO employer SET ?";

                con.query(sql, data, (err, rstSave) => {
                    if (err) throw err;

                    let sqlV = "SELECT * FROM EMPLOYER WHERE VI_VANUMBER=?";
                    con.query(sqlV, newVI, (err, str) => {
                        if (str[0] != null) {
                            let dataJson = {
                                "SaveEmployer": {
                                    "VI_VANUMBER": str[0].VI_VANUMBER,
                                    "CUSTNAME": str[0].CUSTNAME,
                                    "BILL_AMOUNT": str[0].BILL_AMOUNT,
                                    "VI_CCY": str[0].VI_CCY,
                                    "STATUS": "00"
                                }
                            }
                            res.send(dataJson)
                        }
                    })

                })
                // console.log(data)
            })
            // let data = { VI_VANUMBER: req.body.VI_VANUMBER, CUSTNAME: req.body.CUSTNAME, BILL_AMOUNT: req.body.BILL_AMOUNT, VI_CCY: req.body.VI_CCY };
            // console.log(data)
            // let sql = "INSERT INTO employer SET ?";
            // let query = con.query(sql, data, (err, rstSave) => {
            //     if (err) throw err;

            //     let vi = req.body.VI_VANUMBER;
            //     let sqlV = "SELECT * FROM EMPLOYER WHERE VI_VANUMBER=?";
            //     let queryV = con.query(sqlV, vi, (err, str) => {

            //         if (str[0] != null) {
            //             let dataJson = {
            //                 "SaveEmployer": {
            //                     "VI_VANUMBER": str[0].VI_VANUMBER,
            //                     "CUSTNAME": str[0].CUSTNAME,
            //                     "BILL_AMOUNT": str[0].BILL_AMOUNT,
            //                     "VI_CCY": str[0].VI_CCY,
            //                     "STATUS": "00"
            //                 }
            //             }
            //             res.send(dataJson)
            //         }
            //     })

            // })
        } catch (err) {
            res.json({ "SaveEmployer": { "STATUS": "66" } })
        }
    }
}
