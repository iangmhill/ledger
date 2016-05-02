var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');

var ObjectId = mongoose.Schema.Types.ObjectId;

var User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: {
      unique: true,
      dropDups: true
    },
    validate: [
      {validator: isUsernameUnique, msg: 'Username already exists'}
    ]
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  orgs: {
    type: [ObjectId],
    ref: 'orgs',
    required: false,
    default: []
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

function isUsernameUnique(value, done) {
  if (value) {
    mongoose.models['users'].count({ _id: {'$ne': this._id }, username: value }, function (err, count) {
      if (err) {
        return done(err);
      }
      // If `count` is greater than zero, "invalidate"
      done(!count);
    });
  }
}

// generating a hash
User.statics.generateHash = function(password) {
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