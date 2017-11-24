var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

//Db
var db = {};
db.mongo = require('mongodb').MongoClient;
db.mongoURI = 'mongodb://localhost:27017/beaconsBack';





app.get('/', function(req, res){
  // res.sendFile(__dirname + '/home.html');

  db.mongo.connect(db.mongoURI, function(err, dataBase){
  	// dataBase.collection('beacons').update({cellId: 1212121212}, {beaconId: 09090909090, cellId: 1212121212}, {upsert: true}, function(err, data){
  	dataBase.collection('beacons').insertOne({cellId: 1212121212, beaconId: 98989889}, function(err, data){
  		if(err) throw err;

  		res.send('beacon atualizado!');
  		return dataBase.close();
  	});
  })

});

app.get('/beacons', function(req, res){
  // res.sendFile(__dirname + '/home.html');

  db.mongo.connect(db.mongoURI, function(err, dataBase){

  	dataBase.collection('beacons').findOne({}, function(err, collInfos) {
	    return res.send(collInfos);
	});
  })

});

// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
//   socket.on('mensagem', function(msg){
//     io.emit('mensagem', msg);
//   });
// });

http.listen(3000, function(){
  console.log('listening on *:3000');
});