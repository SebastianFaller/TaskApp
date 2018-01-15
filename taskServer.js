var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var httpPort = 8091;
var app = express();
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/taskDB";



//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/addtask', function(req, res) {
    var recievedTask = req.body.task;
    mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
        newEntry = {
            user: "User1",
            task: recievedTask
        };
        db.collection("taskCollection").insertOne(newEntry, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });

    console.log(recievedTask);
    res.send();
});

app.post("/deletetask", function(req, res) {
    mongoClient.connect(url, function(err, db) {
        console.log(req);
        query = {
            task: req.body.toDelete
        };
        db.collection("taskCollection").deleteOne(query, function(err, obj) {
            if (err) throw err;
        });
        db.close();
    });
    res.send();
});

app.post('/gettasks', function(req, res) {
    console.log("entered taskserver gettasks");
    console.log(req.body);
    var token = req.data.token;
    console.log(token);

    jwt.verify(token, 'super_secret_passsword123', function(err, decoded) {
        if (!err) {
            console.log("Token is goood");
            //res.json(secrets);
        } else {
            //res.send(err);
        }
    });

    mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
        db.collection("taskCollection").find({}, {
            user: false,
            _id: false
        }).toArray(function(err, result) {
            if (err) throw err;
            taskArray = [];
            result.forEach(function(item, index) {
                taskArray.push(item.task);
            });
            res.send(taskArray);
            db.close();
        });
    });
});


http.createServer(app).listen(httpPort, function() {
    console.log('Started taskServer!');
});