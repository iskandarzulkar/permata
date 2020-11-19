const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jsonwebtoken');
const basicAuth = require('express-basic-auth');
const userRt = require('./route/usersRt');
const getBillRt = require('./route/getBillRt');
const con = require('./config/db');
const Bcrypt = require('bcrypt');
const ipfilter = require('express-ipfilter').IpFilter;
const { restart } = require('nodemon');

con.connect((err) => {
    if (err) throw err;
    console.log('Database is connected')
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// IP with list
var daftarIP = ['::1'];
app.use(ipfilter(daftarIP, { mode: 'allow' }));

//basic auth
app.use(basicAuth({ authorizer: myAuthorizer, authorizeAsync: true }));

app.get('/', validateUser, function (req, res) {
    res.json({ "tutorial": "Build REST API with node.js" });
});

app.use('/', userRt);
app.use('/', validateUser, getBillRt);
app.set('secretKey', 'nodeRestApi');


// Basic Auth 
function myAuthorizer(username, password, cb, res) {
    var username = username;
    var password = password;
    let sql = "SELECT * FROM users WHERE username = '" + username + "'";
    let query = con.query(sql, (err, userInfo) => {
        var euname = userInfo[0].username
        var epass = userInfo[0].password
        if (username == euname && Bcrypt.compareSync(password, epass)) {
            return cb(null, true)
        } else {
            return cb(null, false)
        }
    })
}
// validate token 
function validateUser(req, res, next) {
    const hd = req.headers['x-access-token'];
    jwt.verify(hd, req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null })
        } else {
            next();
        }
    })

}

app.listen(3000, () => {
    console.log('your server is running at http://localhost:3000')
})