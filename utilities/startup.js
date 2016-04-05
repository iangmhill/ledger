/**
 * Startup function
 * @module utilities/startup
 * @requires NPM:q
 * @requires models/userModel
 * @requires models/orgModel
 */

'use strict';

var User = require('../models/userModel');
var Org  = require('../models/orgModel');
var q    = require('q');

var errors = {
  ADMIN_FIND: 'Failure when attempting to find admin user',
  ADMIN_IMPOSSIBLE: 'Found neither 0 nor 1 number of admin users',
  ADMIN_SAVE: 'Could not save admin user',
  SYSTEM_FIND: 'Failure when attempting to find system org',
  SYSTEM_IMPOSSIBLE: 'Found neither 0 nor 1 number of system orgs',
  SYSTEM_SAVE: 'Could not save system organization'
};

module.exports = {
  /**
   * Initializes the database with an admin user and a system org if they do not
   * already exist.
   */
  initialize: function() {
    var deferred = q.defer();
    var systemOrgId;
    Org.find({name: 'system'}, function(err, orgs) {
      if (err) { return deferred.resolve(errors.SYSTEM_FIND) };
      switch (orgs.length) {
        case 0:
          Org.create({
            name: 'system',
            budgeted: false,
            terminal: false
          }, function (err, system) {
            if (err) { return deferred.resolve(errors.SYSTEM_SAVE) };
            systemOrgId = system._id;
          });
          break;
        case 1:
          systemOrgId = orgs[0]._id;
          break;
        default:
          return deferred.resolve(errors.SYSTEM_IMPOSSIBLE)
      }
      User.find({username: 'admin'}, function(err, users) {
        if (err) { return deferred.resolve(errors.ADMIN_FIND) };
        switch (users.length) {
          case 0:
            User.generateHash('changePassword').then(function(hash) {
              User.create({
                username: 'admin',
                password: hash,
                name: 'Frank Olin',
                email: 'core@students.olin.edu',
                orgs: [systemOrgId],
                isAdmin: true,
                isApproved: true
              }, function (err, admin) {
                if (err) { return deferred.resolve(errors.ADMIN_SAVE) };
                deferred.resolve();
              });
            })
            break;
          case 1:
            deferred.resolve();
            break;
          default:
            return deferred.resolve(errors.ADMIN_IMPOSSIBLE);
        }
      });
    });
    
    return deferred.promise;    
  }
};