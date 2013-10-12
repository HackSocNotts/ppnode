var mongoose = require("mongoose")
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId
, models = require("./models");

var Toilet = mongoose.model("Toilet");
var Rating = mongoose.model("Rating");

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
