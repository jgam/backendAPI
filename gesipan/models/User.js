// models/User.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs'); //1

//schema // 1
var userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required!'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      select: false
    },
    name: { type: String, required: [true, 'Name is required!'] },
    email: { type: String }
  },
  {
    toObject: { virtuals: true }
  }
);

//virtuals // 2
userSchema
  .virtual('passwordConfirmation')
  .get(function() {
    return this._passwordConfirmation;
  })
  .set(function(value) {
    this._passwordConfirmation = value;
  });

userSchema
  .virtual('originalPassword')
  .get(function() {
    return this._originalPassword;
  })
  .set(function(value) {
    this._originalPassword = value;
  });

userSchema
  .virtual('currentPassword')
  .get(function() {
    return this._currentPassword;
  })
  .set(function(value) {
    this._currentPassword = value;
  });

userSchema
  .virtual('newPassword')
  .get(function() {
    return this._newPassword;
  })
  .set(function(value) {
    this._newPassword = value;
  });

// password validation // 3
userSchema.path('password').validate(function(v) {
  var user = this; // 3-1

  // create user // 3-3
  if (user.isNew) {
    // 3-2
    if (!user.passwordConfirmation) {
      console.log('hereee');
      console.log(user.passwordConfirmation);
      user.invalidate(
        'passwordConfirmation',
        'Password Confirmation is required!'
      );
    }
    if (user.password !== user.passwordConfirmation) {
      user.invalidate(
        'passwordConfirmation',
        'Password Confirmation does not matched!'
      );
    }
  }

  // update user // 3-4
  if (!user.isNew) {
    if (!user.currentPassword) {
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    if (
      user.currentPassword &&
      !bcrypt.compareSync(user.currentPassword, user.originalPassword)
    ) {
      //compareSync checks if inputted hash and password's hash is equal.
      //convert text to hash and compare if it is equal, rather than vice versa.
      //2
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }
    if (user.newPassword !== user.passwordConfirmation) {
      user.invalidate(
        'passwordConfirmation',
        'Password Confirmation does not matched!'
      );
    }
  }
});

//hash password //3
userSchema.pre('save', function(next) {
  //pre means, before event(first parameter) occurs, pre executes with callback function
  var user = this;
  if (!user.isModified('password')) {
    return next();
  } else {
    user.password = bcrypt.hashSync(user.password); //3-2 when user changes password, save it as hash
    return next();
  }
});

//model methods // 4
userSchema.methods.authenticate = function(password) {
  var user = this;
  return bcrypt.compareSync(password, user.password);
};

// model & export
var User = mongoose.model('user', userSchema);
module.exports = User;
