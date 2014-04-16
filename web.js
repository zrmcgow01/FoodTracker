//Final  Project
//Comp-20

var express = require('express');
var mongo = require('mongodb');
var logfmt = require("logfmt");
var twilio = require('twilio');

var app = express(express.logger());

//enable CORS: Cross Domain Scripting
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.use(express.json());    

//Setup a mongo Uri
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';


var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
	db = databaseConnection;
});

app.use(express.logger());
app.use(express.urlencoded());
/*
app.post('/', function (request, response){
		db.collection("foodData", function(err, collection){
			var user_Fooddoc = collection.find({username : req.body.username});
			if (user_Fooddoc == null
		}
}
*/

