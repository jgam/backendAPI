//routes/posts.js

var express = require('express');
var router = express.Router();
var Post = require('../models/Post');

//Index
router.get('/', function(req, res) {
  console.log('1');
  Post.find({}) //use an empty query object, which selects all documents in a collection
    .sort('-createdAt') //sort by createdAt
    .exec(function(err, posts) {
      //what to do with data? we put in res.render
      if (err) return res.json(err);
      res.render('posts/index', { posts: posts });
    });
});

//New
router.get('/new', function(req, res) {
  console.log('2');

  res.render('posts/new');
});

//create
router.post('/', function(req, res) {
  //when there is router post
  console.log('3');

  Post.create(req.body, function(err, post) {
    //creates data in db(data, callback Function)
    if (err) return res.json(err); //here post is the created data if not, then error
    res.redirect('/posts'); //automatically renders index in posts directory
  });
});

// show
router.get('/:id', function(req, res) {
  console.log('4');

  Post.findOne({ _id: req.params.id }, function(err, post) {
    if (err) return res.json(err);
    res.render('posts/show', { post: post });
  });
});

// edit
router.get('/:id/edit', function(req, res) {
  Post.findOne({ _id: req.params.id }, function(err, post) {
    if (err) return res.json(err);
    res.render('posts/edit', { post: post });
  });
});

// update
router.put('/:id', function(req, res) {
  console.log('edit did');
  req.body.updatedAt = Date.now(); // 2
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, post) {
    if (err) return res.json(err);
    res.redirect('/posts/' + req.params.id);
  });
});

// destroy
router.delete('/:id', function(req, res) {
  Post.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return res.json(err);
    res.redirect('/posts');
  });
});

module.exports = router;
