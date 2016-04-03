/**
 * Model field validation module.
 * @module utilities/validation
 * @requires NPM:q
 * @requires NPM:validator
 * @requires models/userModel
 */
 
'use strict';

var validator = require('validator');
var User      = require('../models/userModel');
var q         = require('q');

module.exports = {
  /**
   * Validates the four important properties of a user.
   * @param {string} username The username to be validated.
   * @param {string} password The password to be validated.
   * @param {string} name The real name to be validated.
   * @param {string} email The email address to be validated.
   * @return {Promise.<boolean>} Whether all four properties are valid.
   */
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
  /**
   * Validates a username.
   * @param {string} username The username to be validated.
   * @return {Promise.<boolean>} Whether the username is valid.
   */
  username: function(username) {
    var deferred = q.defer();
    User.find({username: username}, function(err, users) {
      return deferred.resolve(!err && users.length == 0)
    })
    return deferred.promise;
  },
  /**
   * Validates a password.
   * @param {string} password The password to be validated.
   * @return {boolean} Whether the password is valid.
   */
  password: function(password) {
    return typeof password === 'string';
  },
  /**
   * Validates a real name.
   * @param {string} username The real name to be validated.
   * @return {boolean} Whether the real name is valid.
   */
  name: function(name) {
    return typeof name === 'string' && name.trim().length > 0;
  },
  /**
   * Validates an email.
   * @param {string} username The email to be validated.
   * @return {boolean} Whether the email is valid.
   */
  email: function(email) {
    return typeof email === 'string' && validator.isEmail(email);
  }
};