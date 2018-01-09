var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var httpPort = 8090;
var app = express();
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/taskDB";



//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


/*
 mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
        newEntry = {
            name: "Max",
            pwd: "123"
        };
        db.collection("usersCollection").insertOne(newEntry, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });
    */


//authorize access to public directory to server html, css, js
app.use(express.static(path.join(__dirname, 'public')));


//handle request of login
app.post('/login', function(req, res) {
    console.log("I got something");
    //declaration response part
    var succ = true;
    var errorSet = [];

    //get param
    var username = req.body.name;
    var password = req.body.pwd;

    //check param
    if (!username || !password) {
        succ = false;
        errorSet.push("MISSING_PARAMS");
    }
    if (succ) {
        if (username != "max" || password != "123") {
            succ = false;
            errorSet.push("USER_NOT_EXIST");
        }
    }

    var link = "";
    if (succ) {
        console.log(succ);
        link = "https://127.0.01:8089/routing.html";
    }
    //send response
    res.send({
        success: succ,
        errorSet: errorSet,
        hlink: link
    });


});


//Enregistrate new user or say it already exists.
app.post('/registrate', function(req, res) {
    //declaration response part
    var errorSet = [];

    //get param
    var username = req.body.name;
    var pwd = req.body.pwd;

    console.log("Received username and pwd");
    console.log(username);
    console.log(pwd);

    if(!checkValidity(pwd)){
        errorSet.push("Password not valid");
    }
    //Add user
    mongoClient.connect(url, function(err, db) {
        //TODO Check whether user exists
        if (err) {
            throw err;
        }
        query = {name: username};

        db.collection("userCollection").find(query).toArray(function(err, result){
            if (err) {
                throw err;
            }
            if(result!=null&&result.length>0){
                console.log("Refused to create User")
                errorSet.push("User already exists");
            }
        });
        //if everything went good so far, create the user
        if(errorSet.length <= 0){
        newEntry = {
            name: username,
            password: pwd
        };
        db.collection("userCollection").insertOne(newEntry, function(err, res) {
            if (err) throw err;
            db.close();
        });   
        }
    });
    link = "https://127.0.01:8089/index.html";

    console.log("Everthings still alright")
    //send response
    res.send({
        errorSet: errorSet,
        hlink: link
    });
});


function checkValidity(password){
    return password.length >= 3;
}

http.createServer(app).listen(httpPort, function() {
    console.log('Started loginServeur!');
});