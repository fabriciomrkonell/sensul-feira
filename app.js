'use strict';

var express = require('express'),
    path = require('path'),
    app = express(),
    mqtt = require('mqtt'),
		client = mqtt.connect('mqtt://test.mosquitto.org'),
		http = require('http').Server(app),
		io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '/')));

client.on('connect', function () {
	console.log('Conectado!');
	client.subscribe('automation');
});

client.on('message', function(topic, message) {
	if(message.length === 3) return false;
  io.emit('automation', JSON.parse(message.toString()));
});

io.on('connection', function(socket){
  socket.on('automation', function(msg){
    client.publish('automation', msg);
  });
});

http.listen(3000, function(){
	console.log('Sensul Feira started.');
});