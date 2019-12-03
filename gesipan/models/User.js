// models/User.js

var mongoose = require("mongoose");

//schema // 1
var userSchema = mongoose.Schema({
    username: {type:String, required:[true, "Username is required!"], unique:true},
    password: {type:String, required:[true, "Password is required!"], select:false},
    name: {type:String, required:[true, "Name is required!"]},
    email:{type:String}
},{
    toObject:{virtuals:true}
});

//virtuals // 2
userSchema.virtual("passwordConfirmation").get(function(){ return this._passwordCOnfirmation;});

userSchema.virtual("originalPassword").get(function(){return this._originalPassword;}).set(function(value){this._originalPassword=value;});

userSchema.virtual("currentPassword").get(function(){return this._currentPassword;}).set(function(value){this._currentPassword=value;});

userSchema.virtual("newPassword").get(function(){return this._newPassword;}).set(functino(value){this._newPassword=value;});

// password validation
userSchema.path("password").validate(function(v){
    var user = this;

    //create user
    if(user.isNew){
        if(!user._passwordCOnfirmation){
            user.invalidate("passwordConfirmation", "Password Confirmation is required!");
        }
        if(user.password !== user.passwordConfirmation){
            user.invalidate("passwordConfirmation", "Password confirmation is not matched!");
        }
    }

    //update user
    if(!user.isNew){
        if(!user.currentPassword){
            user.invalidate("currentPassword", "Current Password is required!");
        }
        if(user.currentPassword && user.currentPassword != user.originalPassword){
            user.invalidate("currentPassword", "Current Password is invalid!");
        }
        if(user.newPassword !== user.passwordConfirmation){
            user.invalidate("passwordConfirmation", "Password Confirmation is not matched!");
        }
    }
});

var User = mongoose.model("user", userSchema);
module.exports = User;