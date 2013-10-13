#!/usr/bin/nodemon

var express = require('express'),
app = module.exports = express.createServer(),
routes = require('./routes'),
mongoose = require('mongoose');
//MongoStore = require('connect-mongo')(express);

mongoose.connect('mongodb://heroku_app18637158:i1baho1d5aatm5nl20kse5cnta@ds049538.mongolab.com:49538/heroku_app18637158');

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(app.router);
app.use(express.static(__dirname + '/public'));

app.get('/', routes.index);
app.get('/toilets', routes.toilets);
app.get('/popdb', routes.popdb);
app.get('/getAllToilets', routes.getAllToilets);
app.get('/rating/add/:tid/:rating', routes.addRating); //maybs post
app.get('/rating/get/:tid', routes.getRating);
app.get('/rating/getAll', routes.getAllRatings);
app.get('/login', routes.login);
app.get('/getAllRatings', routes.getAllRatings);
app.get('/confirm', routes.confirm);

app.post('/toilets', routes.toilets);
app.post('/popdb', routes.popdb);
app.post('/getAllToilets', routes.getAllToilets);
app.post('/rating/add/:tid/:rating', routes.addRating); //maybs post
app.post('/rating/get/:tid', routes.getRating);
app.post('/rating/getAll', routes.getAllRatings);
app.post('/login', routes.login);

app.listen(process.env.PORT || 3000, function(){
    console.log("Server started on port %d", app.address().port);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function(){
	console.log("Mongoose started!");
	
    });
});
