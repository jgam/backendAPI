//models/Comment.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//schema
var commentSchema = mongoose.Schema(
    {
        nickname:{
            type:String
        },
        content: {
            type:String,
            required: [true, "content is required!"],
        },
        likes:{
            type: Number
        },
        dislikes:{
            type: Number
        }
    },
    {
        toObject: {virtuals: true}
    }
);


var Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;