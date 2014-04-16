//Final  Project
//Comp-20

var express = require('express');
var mongo = require('mongodb');
var logfmt = require("logfmt");
var twilio = require('twilio');

var app = express(express.logger());
app.use(express.bodyParser());  


app.all('/incomingText', function(req, res, next) {
  // Enabling CORS
  // See http://stackoverflow.com/questions/11181546/node-js-express-cross-domain-scripting
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

 

//Setup a mongo Uri
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';


var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
});


app.post('/incomingText', function (request, response) {
  response.set('Content-Type', 'text/json');
    mongo.Db.connect(mongoUri, function (err, db) {
      if(err){
        response.send('500');
      }
      db.collection("texts", function (er, collection){
      	var text = request.body.Body;
      	var from = request.body.From;
      	console.log(text + "    " + from);
      	collection.insert({"textData": text, "From": from}, function (err, r){});
      	response.send('{"status":"good"}');
      });
    });
});


