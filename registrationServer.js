var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var httpPort = 8093;
var app = express();
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/taskDB";



//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//authorize access to public directory to server html, css, js
app.use(express.static(path.join(__dirname, 'public')));


app.post('/registrate', function(req, res) {
    //declaration response part
    var errorSet = [];

    //get param
    var username = req.body.name;
    var pwd = req.body.pwd;

    if(!checkValidity(pwd)){
        errorSet.push("Password not valid");
    }
    //check if user already exists 
    mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
       //TODO Check whether user exists
    });

    //Add user
    mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
        newEntry = {
            name: username,
            password: pwd
        };
        db.collection("userCollection").insertOne(newEntry, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });
    link = "https://127.0.01:8089/index.html";

    //send response
    res.send({
        errorSet: errorSet,
        hlink: link
    });
});

http.createServer(app).listen(httpPort, function () {
   console.log('Started registrationServeur!');
});

function checkValidity(password){
    return password.size() > 8;
}