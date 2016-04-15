var validator = require('validator');
var User      = require('../models/userModel');
var Org      = require('../models/orgModel');
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
  },
  stringCheck: function(content){
    return typeof content === 'string' && content.trim().length > 0;
  },
  numberCheck: function(content){
    content = String(content);
    return(validator.isIn(content) || validator.isFloat(content));
  },
  org: function(org){
  //temparory
  var deferred = q.defer();
  if (typeof org === 'string' && org.trim().length > 0){
    deferred.resolve(true);
  } else {
    deferred.reject(false);
  }
  return deferred.promise;
  // return typeof org === 'string' && org.trim().length > 0;
  },
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

module.exports = validation;

