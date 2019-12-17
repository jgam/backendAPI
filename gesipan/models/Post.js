//model/Post.js
//this is model creation with mongo db

var mongoose = require('mongoose');
var util = require("../util");//1

//schema
var postSchema = mongoose.Schema(
  {
    //postSchema is composed of title, body, createdAt, updatedAt
    title: { type: String, required: [true,"Title is required!"]},//2
    body: { type: String, required:[true, "Body is required!"] },//2
    createdAt: { type: Date, default: Date.now }, //can set default
    updatedAt: { type: Date }
  },
  {
    toObject: { virtuals: true }
  }
);
/*
var userModel = mongoose.model('users', postSchema);
var person = new userModel({ title: '11', body: '333' });
person.save(function(err, res) {
  if (err) {
    return;
  }
  console.log('added to db');
});
*/
//virtuals //3
postSchema.virtual('createdDate').get(function() {
  //inside of postSchema, virtually access entity
  //using virtual method,
  return util.getDate(this.createdAt); //update createdDate : getDate(this.createdAt)
});

postSchema.virtual('createdTime').get(function() {
  return util.getTime(this.createdAt);
});

postSchema.virtual('updatedDate').get(function() {
  return util.getDate(this.updatedAt);
});

postSchema.virtual('updatedTime').get(function() {
  return util.getTime(this.updatedAt);
});

// model & export
var Post = mongoose.model('post', postSchema);
module.exports = Post;

//functions
function getDate(dateObj) {
  if (dateObj instanceof Date)
    return (
      dateObj.getFullYear() +
      '-' +
      get2digits(dateObj.getMonth() + 1) +
      '-' +
      get2digits(dateObj.getDate())
    );
}

function getTime(dateObj) {
  if (dateObj instanceof Date)
    return (
      get2digits(dateObj.getHours()) +
      ':' +
      get2digits(dateObj.getMinutes()) +
      ':' +
      get2digits(dateObj.getSeconds())
    );
}

function get2digits(num) {
  return ('0' + num).slice(-2);
}
