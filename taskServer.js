var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');


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
    var errSet = [];
    var token = req.body.token;

    jwt.verify(token, 'super_secret_passsword123', function(err, decoded) {
        if (err) {
            //Token is not valid
            errSet.push("Please log in to do this request");
            console.log("Token is baaaad");
            res.send({
                errorSet: errSet
            });
        } else {
            //token is valid
            var username = jwt.decode(token).user;
            var recievedTask = req.body.task;
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    throw err;
                }
                newEntry = {
                    user: username,
                    task: recievedTask
                };
                db.collection("taskCollection").insertOne(newEntry, function(err, res) {
                    if (err) throw err;
                    db.close();
                });
            });

            console.log(recievedTask);
            res.send();
        }
    });
});

app.post("/deletetask", function(req, res) {
    var errSet = [];
    var token = req.body.token;
    console.log("Delet rec tok "+token);
    jwt.verify(token, 'super_secret_passsword123', function(err, decoded) {
        if (err) {
            //Token is not valid
            errSet.push("Please log in to see this page");
            console.log("Token is baaaad in delete");
            res.send({
                errorSet: errSet
            });
        } else {
            //token is valid
            var username = jwt.decode(token).user;

            console.log("Token is goood");
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    errSet.push("INTERNAL_ERROR");
                    console.log("Unable to connect to mongoDB: " + err);
                } else {

                    //alles gut
                    //
                    query = {
                        task: req.body.toDelete,
                        user: username
                    };
                    db.collection("taskCollection").deleteOne(query, function(err, obj) {
                        if (err) throw err;
                    });
                }
                db.close();
            });
        }
        res.send();
    });
});


app.post("/taskdone", function(req, res) {
    var errSet = [];
    var token = req.body.token;
    console.log("Done rec tok "+token);
    jwt.verify(token, 'super_secret_passsword123', function(err, decoded) {
        if (err) {
            //Token is not valid
            errSet.push("Please log in to see this page");
            console.log("Token is baaaad in done");
            res.send({
                errorSet: errSet
            });
        } else {
            //token is valid
            var username = jwt.decode(token).user;

            console.log("Token is goood");
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    errSet.push("INTERNAL_ERROR");
                    console.log("Unable to connect to mongoDB: " + err);
                } else {

                    query = {
                        task: req.body.task,
                        user: username
                    };
                    //clone the object
                    newTask = JSON.parse(JSON.stringify(req.body.task));
                    newTask.done = true;
                    console.log("Here is the new task "+JSON.stringify(newTask));
                    newValue = {$set: {task: newTask}};
                    db.collection("taskCollection").updateOne(query, newValue, function(err, obj) {
                        if (err) throw err;
                    });
                }
                db.close();
            });
        }
        res.send();
    });
});


app.post('/gettasks', function(req, res) {
    var errSet = [];
    var token = req.body.token;

    jwt.verify(token, 'super_secret_passsword123', function(err, decoded) {
        if (err) {
            //Token is not valid
            errSet.push("Please log in to see this page");
            console.log("Token is baaaad");
            res.send({
                tasks: {},
                errorSet: errSet
            });
        } else {
            //token is valid
            var username = jwt.decode(token).user;

            console.log("Token is goood");
            mongoClient.connect(url, function(err, db) {
                if (err) {
                    //TODO do everywhere like that instead of throw err;
                    errSet.push("INTERNAL_ERROR");
                    console.log("Unable to connect to mongoDB: " + err);
                } else {
                    db.collection("taskCollection").find({
                        user: username
                    }, {
                        user: false,
                        _id: false
                    }).toArray(function(err, result) {
                        if (err) throw err;
                        taskArray = [];
                        result.forEach(function(item, index) {
                            taskArray.push(item.task);
                        });
                        res.send({
                            tasks: taskArray,
                            errorSet: errSet
                        });
                    });
                }
                db.close();
            });
        }
    });
});


http.createServer(app).listen(httpPort, function() {
    console.log('Started taskServer!');
});