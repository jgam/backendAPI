var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

//Database
mongoose.Promise = global.Promise;
console.log(process.env.MONGO_DB);
mongoose.connect(process.env.MONGO_DB, {userMongoClient:true});
var db = mongoose.connection;

//process.env.MONGO_DB;

db.once('open', function(){
    console.log('DB connected!');
});
db.on('error', function(err){
    console.log('DB ERROR: ', err);
})

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(function (req, res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'Get, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'content-type');
    next();
})

// API
app.use('/api/heroes', require('./api/heroes'));

//server
var port = 3001;
app.listen(port, function(){
    console.log('listening on port:' + port);
})