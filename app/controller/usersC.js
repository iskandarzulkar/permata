const Bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');
const con = require('../../config/db');
// const basicAuth = require('express-basic-auth')
const { use } = require('../../route/usersRt');


module.exports = {
    create: function async(req, res) {
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;
        try {
            //validation required
            if (!username || !email || !password) {
                res.send(JSON.stringify(
                    {
                        "status": 200,
                        "error": "error",
                        "message": "Please fill in all the fields"
                    }
                ))
            }
            //validation check user 
            let sql = "SELECT * FROM users WHERE email='" + email + "'";
            let query = con.query(sql, (err, userInfo) => {
                if (userInfo[0] == null) {
                    const hash = Bcrypt.hashSync(password, saltRounds);
                    const crt = { username: req.body.username, email: req.body.email, password: hash }
                    let sQl = "INSERT INTO users SET ?"
                    let query = con.query(sQl, crt, (err, results) => {
                        if (err) throw err;
                        res.send(JSON.stringify(
                            {
                                "status": 200,
                                "error": null,
                                "response": results
                            }
                        ));
                    });
                } else {
                    res.send(JSON.stringify(
                        {
                            "status": 200,
                            "error": "ERROR",
                            "response": "Username/email sudah terdaftar"
                        }
                    ));
                }
            })
        } catch (err) {
            res.send(JSON.stringify(
                {
                    "status": 500,
                    "error": err
                }
            ))
        }
    },
    authenticate: function async(req, res) {
        let email = req.body.email;
        let sql = `SELECT * FROM users WHERE email = ?`
        let query = con.query(sql, [email], (err, userInfo) => {
            if (userInfo[0] == null) {
                res.send(JSON.stringify(
                    {
                        "status": 401,
                        "error": "ERROR",
                        "response": "Username/email tidak valid"
                    }
                ));
            } else {
                let cc = { userInfo };
                let userId = cc.userInfo[0].id;
                let slC = cc.userInfo[0].password;


                if (Bcrypt.compareSync(req.body.password, slC)) {
                    // token
                    const token = jwt.sign({ email: userInfo[0].email }, req.app.get('secretKey'))
                    //save token
                    let ql = "UPDATE users SET TOKEN='" + token + "' WHERE email='" + req.body.email + "'";

                    let newQuery = con.query(ql, token, (err, result) => {
                        console.log(result)

                        res.json({ status: "success", message: "user found!!!", token: token, data: { username: userInfo[0].username, email: userInfo[0].email } });
                    });

                } else {
                    res.json({ status: "error", message: "Invalid email/password!!!", data: null });
                }
            }
        })
    }
}