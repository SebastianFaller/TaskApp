var https = require('https');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var fs = require("fs");
var Ddos = require('ddos');

var httpsPort = 8089;
var app = express();
var mongoClient = require('mongodb').MongoClient;
var axios = require("axios");

//Prevent ddos attacks
var ddos = new Ddos({burst:10, limit:15});
app.use(ddos.express);


//initi parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


//init crypto
var options = {
	key: fs.readFileSync('encryption/server.key'),
	cert: fs.readFileSync('encryption/server.crt')
};

//authorize access to public directory to server html, css, js
app.use(express.static(path.join(__dirname, 'public')));

//login server
require("./taskServer");
//task server
require("./loginServeur");

app.post('/login', function(req, res) {
	axios.post("http://127.0.0.1:8090/login", req.body).then(
		function(response) {
			res.send(response.data);
		},
		function(error) {
			throw error;
		}).catch(function(error) {
		console.log(error);
	});
});

app.post('/addtask', function(req, res) {
	axios.post("http://127.0.0.1:8091/addtask", req.body).then(
		function(response) {
			res.send(response.data);
		},
		function(error) {
			throw error;
		});
});

app.post('/taskdone', function(req, res) {
	axios.post("http://127.0.0.1:8091/taskdone", req.body).then(
		function(response) {
			res.send(response.data);
		},
		function(error) {
			throw error;
		});
});


app.post('/deletetask', function(req, res) {
	axios.post("http://127.0.0.1:8091/deletetask", req.body).then(
		function(response) {
			res.send(response.data);
		},
		function(error) {
			throw error;
		});
});

app.post('/gettasks', function(req, res) {
	axios.post("http://127.0.0.1:8091/gettasks",req.body).then(
		function(response) {
			res.send(response.data);
		},
		function(error) {
			console.log("Error occured while gettasks redirect.");
			throw error;
		});
});

app.post('/registrate', function(req, res) {
	axios.post("http://127.0.0.1:8090/registrate", req.body).then(
		function(response) {
			if (response.data.errorSet.length <= 0) {
				res.send(response.data);
			} else {
				res.send(response.data);
			}
		},
		function(error) {
			throw error;
		});
});


https.createServer(options, app).listen(httpsPort, function() {
	console.log('Started pilotServer!');
});
