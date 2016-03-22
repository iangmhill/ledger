var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var Permissions = mongoose.Schema({
  isUser: {
    type: Boolean,
    required: true,
    default: true
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isOwner: {
    type: Boolean,
    required: true,
    default: false
  }
});

var User = mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  permissions: {
    type: Permissions,
    required: true,
    default: Permissions
  }
});

// generating a hash
User.methods.generateHash = function(password) {
  return new Promise(function(resolve, reject) {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(password, salt, function(err, hash) {
        resolve(hash);
      });
    });
  });
};

// checking if password is valid
User.methods.validPassword = function(password) {
  var hash = this.password;
  return new Promise(function(resolve, reject) {
    console.log(password);
    console.log(hash);
    bcrypt.compare(password, hash, function(err, res) {
      resolve(res);
    });
  });
};

module.exports = mongoose.model("users", User);