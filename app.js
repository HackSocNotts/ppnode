#!/usr/bin/nodemon

var express = require('express'),
app = module.exports = express.createServer(),
routes = require('./routes'),
mongoose = require('mongoose');
//MongoStore = require('connect-mongo')(express);

mongoose.connect('mongodb://localhost/test');

var app = module.exports = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);

app.listen(3000, function(){
    console.log("Server started on port %d", app.address().port);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
	console.log("Mongoose started!");
    });
});
