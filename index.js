var express         = require('express');
var path            = require('path');
var app             = express();
var http            = require('http').Server(app);
var io              = require('socket.io')(http);
var bodyParser      = require('body-parser');

var config          = require('./config')();

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

//Db
var db = {};
db.mongo = require('mongodb').MongoClient;
db.mongoURI = 'mongodb://' + config.db().dbuser + ':' + config.db().dbpassword + '@' + config.db().host + ':' + config.db().port + '/' + config.db().db;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/home.html');
})

app.get('/beacons', function(req, res){
  
  db.mongo.connect(db.mongoURI, function(err, dataBase){

    if(err) throw err;

    dataBase.collection('beacons').find({}).toArray(function(err, beacons) {
      res.send(beacons);

      return dataBase.close();
    });
  })

})

app.post('/beacons', function(req, res){

  console.log(req.body);

  var cellId = req.body.cellId;
  var beaconId = req.body.beaconId;

  db.mongo.connect(db.mongoURI, function(err, dataBase){

    dataBase.collection('beacons').update({cellId: cellId}, {cellId: cellId, beaconId: beaconId}, {upsert: true}, function(err, data){
      if(err) throw err;

      res.send(data);

      io.emit('beacon', {cellId: cellId, beaconId: beaconId});

      return dataBase.close();
    });
  })

})

app.get('/env', function(req, res){

  return res.json({url: process.env.NOW_URL});

})

app.get('/devices', function(req, res){

  db.mongo.connect(db.mongoURI, function(err, dataBase){

    if(err) throw err;

    dataBase.collection('devices').find({}).toArray(function(err, devices) {
      res.send(devices);

      return dataBase.close();
    });
  })

})

app.get('/locations', function(req, res){

  db.mongo.connect(db.mongoURI, function(err, dataBase){

    if(err) throw err;

    dataBase.collection('locations').find({}).toArray(function(err, locations) {
      res.send(locations);

      return dataBase.close();
    });
  })

})

http.listen(3000, function(){
  console.log('listening on *:3000');
});