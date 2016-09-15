'use strict';

var express = require('express'),
    path = require('path'),
    app = express();

app.use(express.static(path.join(__dirname, '/')));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function(){
	console.log('Sensul Feira started.');
});

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://test.mosquitto.org');

client.on('connect', function () {
	console.log('Conectado!');
	client.subscribe('automation');
	client.publish('automation', 'Hello mqtt');
});

client.on('message', function(topic, message) {
  console.log(topic);
  console.log(message.toString());
});