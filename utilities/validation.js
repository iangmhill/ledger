/**
 * Model field validation module.
 * @module utilities/validation
 * @requires NPM:q
 * @requires NPM:validator
 * @requires models/userModel
 * @requires utilities/constants
 */
 
'use strict';

var validator = require('validator');
var Org       = require('../models/orgModel');
var User      = require('../models/userModel');
var Org       = require('../models/orgModel');
var q         = require('q');
var constants = require('./constants');

function emailCheck(email) {
  return typeof email === 'string' && validator.isEmail(email);
}
function stringCheck(content) {
  return typeof content === 'string' && content.trim().length > 0;
}
function numberCheck(content) {
  content = String(content);
  return(validator.isIn(content) || validator.isFloat(content));
}

module.exports = {
  emailCheck: emailCheck,
  stringCheck: stringCheck,
  numberCheck: numberCheck,
  user: {
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
    name: stringCheck,
    /**
     * Validates an email.
     * @param {string} username The email to be validated.
     * @return {boolean} Whether the email is valid.
     */
    email: emailCheck
  },
  request: {
    specification: function(content){
      // var validation = this;
      // if(content.length == 0){
      //   return false;
      // }
      // content.forEach(function(entry){
      //   if(!this.stringCheck(Object.keys(entry)[0]) || !this.numberCheck(Object.values(entry)[0])){
      //     return false;
      //   }
      // })
      return true;
    },
    online: function(content){
      // var validation = this;
      // content.forEach(function(entry){
      //   if(!validation.stringCheck(Object.keys(entry)[0]) || !validation.numberCheck(Object.values(entry)[0])){
      //     return false;
      //   }
      // })
      return true;
    },
    request:function(description, type, value, org, details, online, specification){
      return stringCheck(description) && stringCheck(type) && 
          numberCheck(value) && stringCheck(details) && 
          this.online(online) && this.specification(specification);
    }
  },

  org: {
    org: function(name, shortName, parent, budgeted, budget, nonterminal,
        approvalProcess) {
      var orgValidator = this;
      return this
        .name(name)
          .then(function(isValid) {
            console.log("name " + isValid);
            return isValid && orgValidator.shortName(shortName);
        }).then(function(isValid) {
            console.log("shortName " + isValid);
            return isValid && orgValidator.parent(parent);
        }).then(function(isValid) {
            console.log("parent " + isValid);
            return isValid &&
                orgValidator.budgeted(budgeted, budget) &&
                orgValidator.nonterminal(nonterminal) &&
                orgValidator.approvalProcess(approvalProcess);
        })
    },
    name: function(name) {
      var deferred = q.defer();
      if (!typeof name === 'string') { deferred.resolve(false); }
      Org.find({name: name}, function(err, orgs) {
        return deferred.resolve(!err && orgs.length == 0)
      })
      return deferred.promise;
    },
    shortName: function(shortName) {
      var deferred = q.defer();
      if (!typeof shortName === 'string') { deferred.resolve(false); }
      Org.find({shortName: shortName}, function(err, orgs) {
        return deferred.resolve(!err && orgs.length == 0)
      })
      return deferred.promise;
    },
    parent: function(parent) {
      var deferred = q.defer();
      if (!typeof parent === 'string') { deferred.resolve(false); }
      Org.find({_id: parent}, function(err, orgs) {
        return deferred.resolve(!err && orgs.length == 1 &&
            orgs[0].nonterminal);
      })
      return deferred.promise;
    },
    budgeted: function(budgeted, budget) {
      if (typeof budgeted == 'boolean') {
        return budgeted ? typeof budget == 'number' : true;
      }
      return false;
    },
    nonterminal: function(nonterminal) {
      return (typeof nonterminal == 'boolean');
    },
    approvalProcess: function(approvalProcess) {
      return constants.approvalProcessOptions.indexOf(approvalProcess) > -1;
    }

  },
  // return deferred.promise;
  // return typeof org === 'string' && org.trim().length > 0;
  
  specification: function(content){
    // var validation = this;
    // if(content.length == 0){
    //   return false;
    // }
    // content.forEach(function(entry){
    //   if(!this.stringCheck(Object.keys(entry)[0]) || !this.numberCheck(Object.values(entry)[0])){
    //     return false;
    //   }
    // })
    return true;
  },
  online: function(content){
    // var validation = this;
    // content.forEach(function(entry){
    //   if(!validation.stringCheck(Object.keys(entry)[0]) || !validation.numberCheck(Object.values(entry)[0])){
    //     return false;
    //   }
    // })
    return true;
  },
  request:function(description, type, value, org, details, online, specification){
    var deferred = q.defer();
    var validation = this;
    this.org(org).then(function(isRequestValid) {
      deferred.resolve(
        isRequestValid &&
        validation.stringCheck(description) && validation.stringCheck(type) && 
        validation.numberCheck(value) && validation.stringCheck(details) && 
        validation.online(online) && validation.specification(specification));
    });
    console.log("validation after then function");  
    return deferred.promise;
    // var deferred = q.defer();
    // var validation = this;
    // deferred.resolve(this.stringCheck(description) && this.stringCheck(type) && this.numberCheck(value) && this.org(org) && this.stringCheck(details) && this.online(online) && this.specification(specification));
    // console.log("validation after then function");  
    // return deferred.promise;

    // return (stringCheck(description) && stringCheck(type) && numberCheck(value) && this.org(org) && stringCheck(details) && this.online(online) && this.specification(specification));
  },
  record:function(type, paymentMethod, value, details, org){
    var deferred = q.defer();
    var validation = this;
    this.org(org).then(function(isRecordValid){
      deferred.resolve(
        isRecordValid &&
        validation.stringCheck(details) && validation.stringCheck(type) &&
        validation.numberCheck(value) && validation.stringCheck(details) &&
        validation.stringCheck(paymentMethod));
    },function(err){
      console.log("request validation err");
    });
    console.log("server validation done");  
    return deferred.promise;
  }

};

