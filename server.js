var express = require("express");
var handbars = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cheerio = require("cheerio");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
var PORT = process.env.PORT || 3000;

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json);
app.use(express.static("public"));
app.engine("handlebars",handbars({defaultLayout: "main"}));
app.set("view engine","handlebars");

var routes = require("./routes/apiRoutes");
app.use(routes);

app.listen(PORT,(err)=>{
    if (err) throw err;
    console.log("Server started on port "+PORT);
})