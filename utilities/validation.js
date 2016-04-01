var validator = require('validator');
var User      = require('../models/userModel');
var q         = require('q');

var validation = {
  user: function(username, password, name, email) {
    var deferred = q.defer();
    var validation = this;
    this.username(username).then(function(isUsernameValid) {
      return deferred.resolve(
        isUsernameValid &&
        validation.password(password) &&
        validation.name(name) &&
        validation.email(email));
    });
    return deferred.promise;
  },
  username: function(username) {
    var deferred = q.defer();
    User.find({username: username}, function(err, users) {
      return deferred.resolve(!err && users.length == 0)
    })
    return deferred.promise;
  },
  password: function(password) {
    return typeof password === 'string';
  },
  name: function(name) {
    return typeof name === 'string' && name.trim().length > 0;
  },
  email: function(email) {
    return typeof email === 'string' && validator.isEmail(email);
  }
};

module.exports = validation;