var express = require('express');
var router = express.Router();
var Post = require('../models/Post');
var Comment = require('../models/Comment');
var util = require('../util');

// Index
router.get('/', function(req, res) {
  Post.find({})
    .populate('author')
    .exec((err, data) => {
      console.log(data);
    });
  Post.find({})
    .populate('author')
    .sort('-createdAt')
    .exec(function(err, posts) {
      if (err) return res.json(err);
      res.render('posts/index', { posts: posts });
    });
});

// New
router.get('/new', util.isLoggedin, function(req, res) {
  //util.isLoggedin needs to be true in order to run the callback function
  var post = req.flash('post')[0] || {};
  var errors = req.flash('errors')[0] || {};
  res.render('posts/new', { post: post, errors: errors });
});

// create
router.post('/', util.isLoggedin, function(req, res) {
  req.body.author = req.user._id;
  console.log('******');
  console.log(req.body);
  console.log('******');

  Post.create(req.body, function(err, post) {
    if (err) {
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/new');
    }
    res.redirect('/posts');
  });
});

//create comment .findoneAndUpdate!
router.post('/:id', function(req, res, next) {
  req.body.postID = req.params.id; //this needs to be unique with posts
  
  Comment.create(req.body, function(err, comment) {
    //only after creation, the unique ID is available.
    if (err) {
      return res.json(err);
    }
    //using then?
    var commentID;
    commentID = connectCID(req.params.id,res); //through this, able to connect comment to post
  });

});

// show
router.get('/:id', function(req, res) {
  console.log('im in the show!');
  Post.findOne({ _id: req.params.id })
    .populate('author')
    .populate("comment")//this popupate should do the comment
    .exec(function(err, post) {
      if (err) return res.json(err);
      console.log(post); //here where is the comment field?
      console.log('***********');
      
      res.render('posts/show', { post: post });
    });
});

// edit
router.get('/:id/edit', util.isLoggedin, checkPermission, function(req, res) {
  var post = req.flash('post')[0];
  var errors = req.flash('errors')[0] || {};
  if (!post) {
    Post.findOne({ _id: req.params.id }, function(err, post) {
      if (err) return res.json(err);
      res.render('posts/edit', { post: post, errors: errors });
    });
  } else {
    post._id = req.params.id;
    res.render('posts/edit', { post: post, errors: errors });
  }
});

// update
router.put('/:id', util.isLoggedin, checkPermission, function(req, res) {
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { runValidators: true },
    function(err, post) {
      if (err) {
        req.flash('post', req.body);
        req.flash('errors', util.parseError(err));
        return res.redirect('/posts/' + req.params.id + '/edit');
      }
      res.redirect('/posts/' + req.params.id);
    }
  );
});

// destroy
router.delete('/:id', function(req, res) {
  Post.deleteOne({ _id: req.params.id }, function(err) {
    if (err) return res.json(err);
    res.redirect('/posts');
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next) {
  Post.findOne({ _id: req.params.id }, function(err, post) {
    if (err) return res.json(err);
    if (post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}

//this is a function for connecting CommentID to postID
function connectCID(postID,res) {
  //first check the unique id of comments
  Comment.find({}).exec(function(err, comments) {
    //comments[comments.length - 1].id;
    Post.findOne({ _id: postID }, function(err, post) {
      if (err) return res.json(err);
      //post.comment.push(comments[comments.length - 1].id); //here finally adding the comments ID to post
      postUpdate(res,post, comments, postID,post);
      res.redirect('/posts/'+postID);
      
    });
  });
}

function commentPush(query,comments){
  return query.comment.push(comments[comments.length-1].id);
}

async function postUpdate(res,query, comments, postID,post){
  var result = await commentPush(query, comments);
  Post.findOneAndUpdate(//i feel that this function takes longtime?
    { _id: postID },
    post,
    { runValidators: true, new:true },
    function(err, post) {
      if (err) return console.log(err);
      console.log('finally here lets see...');
      console.log(post);
    }
  );
}