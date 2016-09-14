'use strict';

var express = require('express'),
    path = require('path'),
    app = express();

app.use(express.static(path.join(__dirname, '/')));

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function(){
	console.log('Sensul Feira started.');
});