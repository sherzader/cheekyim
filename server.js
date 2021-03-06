var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http');
var server = http.createServer(app);
server.listen(process.env.PORT || 8000);
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var people = {};

io.on('connection', function(socket) {
  console.log('server is listening');
  people[socket.id] = 'guest' + Math.ceil(Math.random() * 10);
  io.emit('update', people[socket.id] + ' has joined.');
  io.emit('update-people', people);

  socket.on('join', function(name) {
    people[socket.id] = name;
    io.emit('update', name + ' has joined.');
    io.emit('update-people', people);
  });

  socket.on('send', function(msg) {
    io.emit('chat', people[socket.id], msg);
  });

  socket.on('disconnect', function() {
    io.emit('update', people[socket.id] + ' has left.');
    delete people[socket.id];
    io.emit('update-people', people);
  });
});
