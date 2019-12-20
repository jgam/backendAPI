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
        postID: {
            type:String
        },
        likes:{
            type: Number,
            default: 0
        },
        dislikes:{
            type: Number,
            default: 0
        }
    },
    {
        toObject: {virtuals: true}
    }
);


var Comment = mongoose.model('comment', commentSchema);
module.exports = Comment;