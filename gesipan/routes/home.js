// routes/home.js

var express = require('express');
var router = express.Router();

// Home
router.get('/', function(req, res) {
  res.render('home/welcome');
});
router.get('/about', function(req, res) {
  res.render('home/about');
});
router.get('/test', function(req, res) {
  res.render('partials/nav');
});
module.exports = router;
