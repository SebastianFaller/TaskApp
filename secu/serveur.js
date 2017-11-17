var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var httpPort = 8089;
var app = express();
var mongoClient = require('mongodb').MongoClient;


//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//init db
var url = "mongodb://localhost:27017/taskDB";
mongoClient.connect(url, function(err, db) {
    if (err) {
        throw err;
    }

    db.createCollection("taskCollection", function(erro, res) {
        if (erro) {
            throw err;
        }
        db.close();
    });
});



//authorize access to public directory to server html, css, js
app.use(express.static(path.join(__dirname, 'public')));

app.post('/GetData', function(req, res) {
    res.send({
        dataFromServer: "Données du server"
    });
});


app.post('/login', function(req, res) {
    //declaration response part
    var success = true;
    var errorSet = [];

    //get param
    var username = req.body.username;
    var password = req.body.password;

    //check param
    if (!username || !password) {
        succes = false;
        errorSet.push("MISSING_PARAMS");
    }
    if (success) {
        if (username != "axel" && password != "123") {
            succes = false;
            errorSet.push("USER_NOT_EXIST");
        }
    }
    //send response
    res.send({
        success: success,
        errorSet: errorSet
    });
});


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

app.listen(httpPort);