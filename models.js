var mongoose = require("mongoose")
, Schema = mongoose.Schema
, ObjectId = Schema.ObjectId;

var ToiletSchema = new mongoose.Schema({
    id: Number,
    name: String,
    lat: Number,
    longd: Number,
    forCustomer: Boolean,
    details: String
});

var RatingSchema = new mongoose.Schema({
    id: Number,
    ToiletId: Number,
    rating: Number
});

mongoose.model("Toilet", ToiletSchema);
mongoose.model("Rating", RatingSchema);
