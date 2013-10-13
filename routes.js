var mongoose = require("mongoose")
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId
, request = require("request")
, querystring = require("querystring")
, models = require("./models");

var CLIENT_ID = "AYCq0hCZC0PNsKCQpucgLyj3F0tKdNYd489iu8ytS20Ex9MOK-LmbePAFiPc";
var CLIENT_SECRET = "EFt91xAR0t0YKyMIb1KBmlPzb5ngHl_DtCTFrBK-B2aAaB2VSeEKGbCXTZBX";
var REDIRECT_URI = "http://portapaydev.herokuapp.com/";
var SCOPE = "openid profile email address";

var base_webapps = 'https://www.sandbox.paypal.com/webapps/auth/protocol/openidconnect/v1';
var base_api = 'https://api.sandbox.paypal.com/v1/identity/openidconnect';
var endpoint_authorize = base_webapps + '/authorize';
var endpoint_endsession = base_webapps + '/endsession';
var endpoint_tokenservice = base_api + '/tokenservice';
var endpoint_userinfo = base_api + '/userinfo';

var TYPE_JSON = 'json';
var TYPE_FORM = 'form';
 
var user = {};
 
var token = {
  access_token: "",
  refresh_token: "",
  id_token: ""
};
 
var headers = {
  "Accept": "application/json",
  "Content-type": "application/json;charset=UTF-8",
  "Authorization": "Bearer " + token.access_token
};

var Toilet = mongoose.model("Toilet");
var Rating = mongoose.model("Rating");


exports.login = function (req, res) {
  var data = {
    client_id: CLIENT_ID,
    response_type: "code",
    scope: SCOPE,
    redirect_uri: REDIRECT_URI
  };
  console.log(endpoint_authorize + "?" + querystring.stringify(data));
  res.redirect(endpoint_authorize + "?" + querystring.stringify(data));
};

exports.auth = function (req, res) {
  var data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: "authorization_code",
    code: req.query.code
  };
 
  doPost(endpoint_tokenservice, data, TYPE_FORM, function (error, response, body) {
    if (!error) {
      token = JSON.parse(body);
      headers.Authorization = "Bearer " + token.access_token;
      res.redirect("/profile");
    }
  });
};

exports.index = function(req, res){
    res.render('index', {'title':'HI THERE'});
}

exports.toilets = function(req, res){
    Toilet.find(function(err, kittens){
	if (err) console.log("Error!");
	console.log(kittens);
    });
}

exports.popdb = function(req, res){
    Toilet.remove({}, function(err) { 
	console.log('collection removed') 
    });
    Rating.remove({}, function(err) { 
	console.log('collection removed') 
    });
    var t1 = new Toilet({id: 1,
			 name: 'Kudos',
			 lat: 51.5093110,
			 longd: -0.1256770,
			 forCustomer: true,
			 details: ""
			});

    var t2 = new Toilet({id: 2,
			 name: 'The Harp',
			 lat: 51.5095910,
			 longd: -0.1260410,
			 forCustomer: true,
			 details: ""
			});
    var t3 = new Toilet({id: 3,
			 name: 'Two Chairmen',
			 lat: 51.5074037,
			 longd: -0.1301932,
			 forCustomer: true,
			 details: ""
			});
    var t4 = new Toilet({id: 4,
			 name: 'None',
			 lat: 51.5082050,
			 longd: -0.1285538,
			 forCustomer: false,
			 details: "Wheelchair access"
			});
    var t5 = new Toilet({id: 5,
			 name: 'Wetherspoons',
			 lat: 51.506402,
			 longd: -0.127529,
			 forCustomer: true,
			 details: "Wheelchair access"
			});
    t1.save();
    t2.save();
    t3.save();
    t4.save();
    t5.save();
    
    Toilet.find(function(err, toilets){
	if (err) console.log("Error!");
	console.log(toilets);
    });
   
    res.writeHead(200, {"Content-Type":"text/plain"});
    res.end();
}

exports.getAllToilets = function(req, res) {
     Toilet.find(function(err, toilets){
	if (err) console.log("Error!");
	console.log(toilets);
	res.json(toilets);
	res.end();
    });
}

exports.addRating = function(req, res) {
    console.log("tid: " + req.params.tid + " rate: " + req.params.rating);

    var newRating = new Rating({
	ToiletId: req.params.tid,
	rating: req.params.rating
    });

    newRating.save(function(err, fluffy){
	if (err) {
	    res.json({response:'sad elijah'});
	    res.end();
	} else {
	    res.json({Response:'success'});
	    res.end();
	}
    });
}

exports.getRating = function(req, res){
    Rating.find({ToiletId: req.params.tid}, function(err, ratings){
	if (err){
	    res.json({response:'sad elijah'});
	    res.end();
	} else {
	    res.json(ratings);
	    res.end();
	}
    });
}

exports.getAllRatings = function(req, res){
    var jsonRet;
    var counts = [];
    Rating.find({}, function(err, ratings){
      if (err){
	    res.json({response:'sad elijah'});
	    res.end();
	} else {
	    // res.json(ratings);
	    // jsonRet = ratings;
	    for(var i = 0; i < ratings.length; i++){
		if(counts[ratings[i].ToiletId] == undefined){
		    counts[ratings[i].ToiletId] = [];
		    counts[ratings[i].ToiletId][0] = 0;
		    counts[ratings[i].ToiletId][1] = 0;
		}

		counts[ratings[i].ToiletId][0] += ratings[i].rating;
		counts[ratings[i].ToiletId][1] += 1;
		// console.log(counts);
	    }

	    Toilet.find({}, function(err, toilets){
		if (err){
		    res.json({response:'sad elijah'});
		    // res.end();
		} else {
		    var Ts = [];
		    for(var i = 0; i < toilets.length; i++){
			//if(counts[i] !== undefined){
			    Ts[i] = toilets[i].toObject();
			if(counts[i] !== undefined){
			    Ts[i].rating =
			    /*toilets[i].rating =*/ counts[i][0] / counts[i][1];
			}else{
			    Ts[i].rating = -1;
			}
			    console.log(Ts[i]);
			
			//}
		    }
		    // console.log("INSIDE:"+counts);
		    res.json(Ts);
		    //res.end();
		}
		res.end();
	    });
	    
	    // res.end();
	}
  });
    console.log(counts);
}

