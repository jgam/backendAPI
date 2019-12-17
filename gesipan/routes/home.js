// routes/home.js

var express = require('express');
var router = express.Router();
var passport = require('../config/passport');//1

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

// Login // 2
router.get("/login", function (req,res) {
  var username = req.flash("username")[0];
  var errors = req.flash("errors")[0] || {};
  res.render("home/login", {
   username:username,
   errors:errors
  });
 });
 
 // Post Login // 3
 router.post("/login",
  function(req,res,next){
   var errors = {};
   var isValid = true;
   if(!req.body.username){
    isValid = false;
    errors.username = "Username is required!";
   }
   if(!req.body.password){
    isValid = false;
    errors.password = "Password is required!";
   }
 
   if(isValid){
    next();
   } else {
    req.flash("errors",errors);//if not authenticated, creates flash and redirects to login again
    res.redirect("/login");
   }
  },
  passport.authenticate("local-login", {//proceed with the passport local strategy to do authentication
   successRedirect : "/",
   failureRedirect : "/login"
  }
 ));
 
 // Logout // 4
 router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
 });

module.exports = router;
