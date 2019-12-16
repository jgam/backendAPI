// api/heroes.js

var express = require('express');
var router = express.Router();
var Hero = require('../models/hero');
var mongoose = require('mongoose');

// Index
router.get('/',
    function(req, res, next){
        var query = {};
        if(req.query.name) query.name = {$regex:req.query/.name, $options:'i'};//1

        Hero.find(query).sort({id:1}).exec(function(err, heroes){
            if(err){
                res.status(500);
                res.json({success:false, message:err});
            }
            else{
                res.json({success:true, data:heroes});
            }
        });
    });

//show