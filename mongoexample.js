#!/usr/bin/node

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

	var kittySchema = new mongoose.Schema({
	    name: String
	});

	kittySchema.methods.speak = function() {
	    var greeting = this.name ? "Meow name is " + this.name : "I don't have a name'";
	    console.log(greeting);
	}
	
	var Kitten = mongoose.model('Kitten', kittySchema);

	var silence = new Kitten({name: 'Silence'});
	console.log(silence.name);

	var fluffy = new Kitten({name:'fluffy'});
	fluffy.speak();

	fluffy.save(function(err, fluffy){
	    if (err) console.log("Error!");
	    fluffy.speak();
	});

	silence.save();

	Kitten.find(function(err, kittens){
	    if (err) console.log("Error!");
	    console.log(kittens);
	});
	
    });
});
