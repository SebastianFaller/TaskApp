var https = require('https');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var httpsPort = 8091;
var app = express();
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/taskDB";
var fs = require("fs");



//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//init crypto
var options = {
   key  : fs.readFileSync('encryption/server.key'),
   cert : fs.readFileSync('encryption/server.crt')
};



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

app.post("/deletetask", function(req, res){
    mongoClient.connect(url, function(err, db){
        console.log(req);   
        query = {task: req.body.toDelete};
        db.collection("taskCollection").deleteOne(query, function(err, obj){
            if(err) throw err;
        });
        db.close();
    });
    res.send();
});

app.get('/gettasks', function(req, res) {
    mongoClient.connect(url, function(err, db) {
        if (err) {
            throw err;
        }
        db.collection("taskCollection").find({}, {user : false, _id:false}).toArray(function(err, result){
            if(err) throw err;
            taskArray = [];
            result.forEach(function(item, index){
                taskArray.push(item.task);
            });
            res.send(taskArray);
            db.close();
        });
    });
});


https.createServer(options, app).listen(httpsPort, function () {
   console.log('Started taskServer!');
});