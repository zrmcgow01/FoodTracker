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
  

app.use(express.logger());
app.use(express.urlencoded());


