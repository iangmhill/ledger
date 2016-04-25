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
function getObjKeys(obj){
  var keys = [];
  for(var k in obj) keys.push(k);
  return keys
}
function getObjValues(obj){
  var values = [];
  for(var k in obj) values.push(obj[k]);
  return values
}

module.exports = {
  emailCheck: emailCheck,
  stringCheck: stringCheck,
  numberCheck: numberCheck,
  getObjKeys: getObjKeys,
  getObjValues: getObjValues,
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
    items: function(items) {
      if (items.length == 0) { return true; }
      var isValid = 0;
      items.forEach(function(item) {
        isValid += (stringCheck(item.description) && numberCheck(item.price) &&
            constants.itemCategories.indexOf(item.category) > -1) ? 0 : 1;
      })
      return isValid == 0;
    },
    links: function(links) {
      if (links.length == 0) { return true; }
      var isValid = 0;
      links.forEach(function(link) {
        isValid += (stringCheck(link.description) && stringCheck(link.url))
            ? 0 : 1;
      })
      return isValid == 0;
    },
    request:function(description, value, orgId, links, items) {
      var requestValidator = this;
      return Org.findById(orgId, function(err, org) {
        console.log(orgId);
        if (!err && !!org && org.isActive && stringCheck(description) &&
        numberCheck(value) && requestValidator.links(links) &&
        requestValidator.items(items)) {
          console.log(org);
          return Promise.resolve(org.approvalProcess == 'none');
        } else {
          return Promise.reject('Invalid request');
        }
      });
    }
  },
  org: {
    org: function(name, shortName, parent, budgeted, budget, nonterminal,
        approvalProcess) {
      var orgValidator = this;
      return this
        .name(name)
          .then(function(isValid) {
            return isValid && orgValidator.shortName(shortName);
        }).then(function(isValid) {
            return isValid && orgValidator.parent(parent);
        }).then(function(isValid) {
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

  record:function(type, paymentMethod, value, details){
    var validation = this;
    return(
        validation.stringCheck(type) &&
        validation.numberCheck(value) && validation.stringCheck(details) &&
        validation.stringCheck(paymentMethod));
  },

  transfer: {
    transfer: function(base, to, from, value, justification) {
      var deferred = q.defer();
      Org.find({_id: {$in: [base, to, from]}}, function(err, orgs) {
        if (orgs.length != 2 || err) { return deferred.resolve(false); }
        var baseOrg, toOrg, fromOrg;
        for (index in orgs) {
          if (orgs[index]._id == base) { baseOrg = orgs[index]; }
          if (orgs[index]._id == to) { toOrg = orgs[index]; }
          if (orgs[index]._id == from) { fromOrg = orgs[index]; }
        }
        if (!baseOrg || !toOrg || !fromOrg || !toOrg.budgeted ||
            !fromOrg.budgeted) { return deferred.resolve(false); }
        Org.find({ $and: [{parent: org._id}, {budgeted: true}]},
            function(err, children) {
          if (err) { return deferred.resolve(false); }
          Request.find({ $and: [{org: from},{isActive: true}]},
              function(err, requests) {
            if (err) { return deferred.resolve(false); }
            var allocated = 0;
            for (index in requests) {
              allocated += requests[index].value;
            }
            for (index in children) {
              allocated += children[index].budget;
            }
            deferred.resolve(
              to != from &&
              (base == to || base == from) &&
              typeof value === 'number' &&
              value > 0 &&
              value <= fromOrg.budget - allocated &&
              typeof justification === 'string'
            );
          });
        });
      });
      return deferred.promise;
    }
  }

};

