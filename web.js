
/**
 * Module dependencies.
 
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var mongo = require('mongodb');


var app = express();

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/local';


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


app.get('/users', user.list);

app.get('/submit.json', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("scores", function (er, col){
      var d = col.find({}).toArray(function(err, x){
        console.log(x);
      });
      col.find({}).sort("name").toArray(function(e, x){
        res.send(x);
      });
    });
  });
});

app.post('/submitScore', function (req, res){
  mongo.Db.connect(mongoUri, function (err, db){
    db.collection("scores", function (er, collection){
      var score = req.body.score;
      var name = req.body.playerName;
      collection.insert({"score": score, "playerName": name}, function (err, r){});
      res.send("cool beans");
    });
  });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/
// Express initialization
var express = require('express');
var app = express(express.logger());
app.use(express.bodyParser());
app.set('title', 'nodeapp');

app.all('/submit.json', function(req, res, next) {
  // Enabling CORS
  // See http://stackoverflow.com/questions/11181546/node-js-express-cross-domain-scripting
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.all('/scores.json', function(req, res, next) {
  // Enabling CORS
  // See http://stackoverflow.com/questions/11181546/node-js-express-cross-domain-scripting
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.all('/', function(req, res, next) {
  // Enabling CORS
  // See http://stackoverflow.com/questions/11181546/node-js-express-cross-domain-scripting
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
// Mongo initialization, setting up a connection to a MongoDB  (on Heroku or localhost)
var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/comp20'; // comp20 is the name of the database we are using in MongoDB
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function (error, databaseConnection) {
  db = databaseConnection;
});

app.get('/', function (request, response) {
  response.set('Content-Type', 'text/html');
  mongo.Db.connect(mongoUri, function (err, db) {
    if(err){
      response.send('500');
    }
    else{
    db.collection("scores", function (er, collection){
      //data = collection.find();
      collection.find({}).toArray(function (err, docs) {
        if(err){
          response.send('500');
        }
        var jsonArray = [];
        var output = '<h1>2048 Top Scores</h1>';
        //var output = '<head><link rel="stylesheet" type="text/css" media ="screen" href="stylesheet.css"/></head><body><h1>2048 Top Scores</h1>';
        var temp;
        //the next bit of code sorts all objects from the database
        //into descending order in the json object array 'jsonArray'
        for(var x in docs) {
          jsonArray.push(docs[x]);
          if(x != 0) {
            for(var y = (jsonArray.length -1); y > 0; y--) {
              if(parseInt(jsonArray[y]["score"]) > parseInt(jsonArray[y-1]["score"])) {
                temp = jsonArray[y];
                jsonArray[y] = jsonArray[y-1];
                jsonArray[y-1] = temp;
              }
            }
          }
        }
        
        output += '<table border="1" width:"300px"><tr><th>Username</th><th>Score</th><th>Time</th></tr>';
        for(var f in jsonArray) {
          output += '<tr><td>'+jsonArray[f]["username"]+'</td>'; //can't read username of null
          output += '<td>'+jsonArray[f]["score"]+'</td>';
          output += '<td>'+jsonArray[f]["created_at"]+'</td></tr>';
        }
        output += '</table></body>';
        response.send(output);
      });
    });
    }
  });
});

app.post('/submit.json', function (request, response) {
  response.set('Content-Type', 'text/json');
    mongo.Db.connect(mongoUri, function (err, db) {
      if(err){
        response.send('500');
      }
      db.collection("scores", function (er, collection){
        var score = request.body.score;
        var name = request.body.username;
        var gameGrid = request.body.grid;
        var time = request.body.created_at;
        if(name != undefined && score != undefined && gameGrid!= undefined) {
          if(time != undefined){
            collection.insert({"username":name, "score": score, "grid": gameGrid, "created_at": time}, function (err, r){});
          }
          else {
            collection.insert({"username":name, "score": score, "grid": gameGrid, "created_at": " "}, function (err, r){});
          }
          response.send('{"status":"good"}');
        }
        else {
          response.send('{"status":"Request failed. Improper formatting"}');
        }
      });
    });
});

app.get('/scores.json', function (request, response) {
  response.set('Content-Type', 'text/json');
  var user = request.query.username;
  mongo.Db.connect(mongoUri, function (err, db) {
    if(err){
      response.send('500');
    }
    db.collection("scores", function (er, collection){
      collection.find({}).toArray(function (err, docs) {
        if(err){
          response.send('500');
        }
        var jsonArray =[];
        for(var x in docs) {
          jsonArray.push(docs[x]);
          if(x != 0) {
            for(var y = (jsonArray.length -1); y > 0; y--) {
              if(parseInt(jsonArray[y]["score"]) > parseInt(jsonArray[y-1]["score"])) {
                temp = jsonArray[y];
                jsonArray[y] = jsonArray[y-1];
                jsonArray[y-1] = temp;
              }
            }
          }
        }
        var output = "";
        if(user != undefined){
          for(var x in jsonArray) {
            if(jsonArray[x]["username"] == user) {
              output = output + JSON.stringify(jsonArray[x]);
            }
          }
        }
        else {
          output ="[]";
        }
       response.send(output);
      });
    });
  });
});

// Oh joy! http://stackoverflow.com/questions/15693192/heroku-node-js-error-web-process-failed-to-bind-to-port-within-60-seconds-of
app.listen(process.env.PORT || 3000);
