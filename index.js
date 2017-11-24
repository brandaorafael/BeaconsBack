var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser      = require('body-parser');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

//Db
var db = {};
db.mongo = require('mongodb').MongoClient;
db.mongoURI = 'mongodb://localhost:27017/beaconsBack';

app.get('/', function(req, res){
  res.sendFile(__dirname + '/home.html');
})

app.get('/beacons', function(req, res){
  
  db.mongo.connect(db.mongoURI, function(err, dataBase){

    dataBase.collection('beacons').find({}).toArray(function(err, beacons) {
      return res.send(beacons);
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

// io.on('connection', function(socket){
//   socket.on('beacon', function(beacon){
//     io.emit('chat message', msg);
//   });
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});