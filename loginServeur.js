var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var sjcl = require('./sjcl/sjcl.js');
var randomstring = require("randomstring");
const {
    celebrate,
    Joi,
    errors
} = require('celebrate');


var httpPort = 8090;
var app = express();
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/taskDB";



//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//For the use of celebrate
app.use(errors());

//handle request of login
app.post('/login',
    //sanitize for nosql injection
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            pwd: Joi.string().required(),
        })
    }),
    function(req, res) {
        //declaration response part
        var succ = true;
        var errorSet = [];
        var usertoken;

        //get param
        var username = req.body.name;
        var password = req.body.pwd;

        //check param
        if (!username || !password) {
            succ = false;
            errorSet.push("MISSING_PARAMS");
        }
        if (succ) {
            //insert here
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    throw err;
                }

                query = {
                    name: username
                };

                db.collection("userCollection").find(query).toArray(function(err, result) {
                    if (err) {
                        throw err;
                    }
                    if (result != null && result.length > 0) {
                        resultObj = result.pop();
                        //salt password to compare with salted pwd in Database
                        pwdSalt = resultObj.salt;
                        saltedPwd = JSON.stringify(sjcl.hash.sha256.hash(password + pwdSalt));
                        if (resultObj.password != saltedPwd) {
                            succ = false;
                            errorSet.push("USER_NOT_EXIST");
                        } else {
                            //Provide token
                            //token is valid 40 Minutes
                            usertoken = jwt.sign({
                                user: username
                            }, 'super_secret_passsword123', {
                                expiresIn: 2400
                            });
                        }
                    } else {
                        succ = false;
                    }
                    var link = "#!/taskPage";

                    db.close();
                    //send response
                    res.send({
                        success: succ,
                        errorSet: errorSet,
                        hlink: link,
                        token: usertoken
                    });
                });
            });
        }
    });


//Enregistrate new user or say it already exists.
app.post('/registrate', celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        pwd: Joi.string().required(),
    })
}), function(req, res) {
    //declaration response part
    var errSet = [];

    //get param
    var username = req.body.name;
    var pwd = req.body.pwd;
    if (!checkValidity(pwd)) {
        errSet.push("Password must contain a number and be 10 characters long.");
    }
    //salt the pwd
    var pwdSalt = randomstring.generate(10);
    pwd = JSON.stringify(sjcl.hash.sha256.hash(pwd + pwdSalt));

    //Add user
    mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
        query = {
            name: username
        };

        db.collection("userCollection").find(query).toArray(function(err, result) {
            if (err) {
                throw err;
            }
            if (result != null && result.length > 0) {
                errSet.push("User already exists");
            }
            //if everything went good so far, create the user
            if (errSet.length <= 0) {
                newEntry = {
                    name: username,
                    password: pwd,
                    salt: pwdSalt
                };
                db.collection("userCollection").insertOne(newEntry, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
            }
            //for redirection to login page
            link = "#!/loginPage";
            res.send({
                errorSet: errSet,
                hlink: link
            });
            db.close();
        });
    });
});

//Only returns true if password has at least length 10 and contains a number and a letter
function checkValidity(password) {
    var regex = "(\S*[0-9]+\S*[A-Za-z]+\S*)|(\S*[A-Za-z]+\S*[0-9]+\S*)";
    return password.length >= 10 && password.match(regex);
}

http.createServer(app).listen(httpPort, function() {
    console.log('Started loginServeur!');
});