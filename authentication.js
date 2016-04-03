/**
 * Authentication module
 * @module authentication
 * @requires NPM:passport
 * @requires NPM:passport-local
 * @requires models/userModel
 * @requires utilities/validation
 */

'use strict';

var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('./models/userModel');
var validation    = require('./utilities/validation');

module.exports = {
  /**
   * Configures the passport object for use on the server-side of the app.
   * @return {object} The configured passport object.
   */
  configure: function() {
    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
      User.findById(id, function(err, user) {
        done(err, user);
      });
    });
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({ 'username' :  username }, function(err, user) {
        if (err) { return done(err); };
        if (!user || !user.isApproved) { return done(null, false); }
        user.validPassword(password).then(function(isValid) {
          return done(null, isValid ? user : false);
        });
      });
    }));
    return passport;
  },
  /**
   * Ensures that the user is authenticated before proceeding.
   * @param {object} req The HTTP request being handled.
   * @param {object} res The HTTP response to be sent.
   * @param {nextRoute} next The function that should be called if the user
   *     is authenticated.
   */
  authenticateUser: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).send();
  },
  /**
   * Ensures that the user is an organization owner before proceeding.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The user whose owner status is to be evaluated.
   * @param {ObjectID[]} req.user.orgs The organizations the user owns.
   * @param {object} res The HTTP response to be sent.
   * @param {nextRoute} next The function that should be called if the user is
   *     an organization owner.
   */
  authenticateOwner: function(req, res, next) {
    if (req.isAuthenticated() && (req.user.orgs.indexOf(req.body.org) > -1)) {
      return next();
    }
    res.status(401).send();
  },
  /**
   * Ensures that the user is an administrator before proceeding.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The user whose admin status is to be evaluated.
   * @param {boolean} req.user.isAdmin Whether or not the user is an admin.
   * @param {object} res The HTTP response to be sent.
   * @param {nextRoute} next The function that should be called if the user is
   *     an administrator.
   */
  authenticateAdmin: function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) { return next(); }
    res.status(401).send();
  },
  /**
   * Register a new user account.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.body The request data sent by the client.
   * @param {string} req.body.username The username of the user being created.
   * @param {string} req.body.password The password of the user being created.
   * @param {string} req.body.name The real name user being created.
   * @param {string} req.body.email The email address of the user being created.
   * @param {object} res The HTTP response to be sent.
   */
  register: function(req, res) {
    var errorResponse = { isSuccessful: false, isValid: false };
    if (req.user) {
      return res.json(errorResponse);
    }
    validation.user(
      req.body.username,
      req.body.password,
      req.body.name,
      req.body.email
    ).then(function(isValid) {
      if (!isValid) { return res.json(errorResponse); }
      User.generateHash(req.body.password).then(function(hash) {
        User.create({
          username: req.body.username,
          password: hash,
          email: req.body.email,
          name: req.body.name
        }, function(err, user) {
          return res.json({
            isSuccessful: !!user && !err,
            isValid: true
          });
        })
      });
    })
  },
  /**
   * Check to ensure that a username is unique.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.body The request data sent by the client.
   * @param {string} req.body.username The username whose uniqueness is to be
   *     verified.
   * @param {object} res The HTTP response to be sent.
   */
  checkUniqueUsername: function(req, res) {
    validation.username(req.body.username).then(function(isValid) {
      res.json({ isUnique: isValid });
    })
  },
  /**
   * Authenticate a user.
   * @param {object} req The HTTP request being handled.
   * @param {object} res The HTTP response to be sent.
   * @param {nextRoute} next The function that should be called once user
   *     authentication has been attempted.
   */
  login: function(req, res, next) {
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  },
  /**
   * Log out a user.
   * @param {object} req The HTTP request being handled.
   * @param {object} res The HTTP response to be sent.
   */
  logout: function(req, res){
    req.logout();
    res.redirect('/login');
  },
  /**
   * Return a user's permissions.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The authenticated user.
   * @param {string} req.user.username The username of the user.
   * @param {string} req.user.name The real name of the user.
   * @param {string} req.user.email The email address of the user.
   * @param {ObjectID[]} req.user.orgs The orgs of which the user is an owner.
   * @param {boolean} req.user.isAdmin Whether the user is an admin.
   * @param {object} res The HTTP response to be sent.
   */
  getUserPermissions: function(req, res) {
    if (req.isAuthenticated()) {
      res.json({
        isAuthenticated: true,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        orgs: req.user.orgs,
        isAdmin: req.user.isAdmin
      });
    } else {
      res.json({
        isAuthenticated: false
      });
    }
  },
  /**
   * Confirm the vailidity of a user's password.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The authenticated user.
   * @param {ObjectID} req.user._id The ObjectID string of the user.
   * @param {string} req.body The request data sent by the client.
   * @param {string} req.body.password The password entered by the user.
   * @param {object} res The HTTP response to be sent.
   * @param {nextRoute} next The function that should be called once the
   *     user's password has been evaluated.
   */
  confirmPassword: function(req, res, next) {
    var password = req.body.password;
    var errorResponse = {
      isSuccessful: false,
      isAuthenticated: false,
      error: 'Invalid password.'
    };
    if (!validation.password(password)) { return res.json(errorResponse); }
    User.findById({_id: req.user._id}, function(err, user) {
      if (err) { return next(err); };
      if (!user) { return res.json(errorResponse); }
      user.validPassword(password).then(function(isValid) {
        if (!isValid) { return res.json(errorResponse); }
        return next();
      }); 
    });
  },
  /**
   * Change a user's email address.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The authenticated user.
   * @param {ObjectID} req.user._id The ObjectID string of the user.
   * @param {string} req.user.username The username of the user.
   * @param {string} req.user.name The real name of the user.
   * @param {string} req.user.email The email address of the user.
   * @param {ObjectID[]} req.user.orgs The orgs of which the user is an owner.
   * @param {boolean} req.user.isAdmin Whether the user is an admin.
   * @param {object} req.body The request data sent by the client.
   * @param {string} req.body.newEmail The new email address for the user.
   * @param {object} res The HTTP response to be sent.
   */
  changeEmail: function(req, res) {
    var newEmail = req.body.newEmail;
    var errorResponse = {
      isAuthenticated: true,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      orgs: req.user.orgs,
      isAdmin: req.user.isAdmin
    };
    if (!validation.email(newEmail)) { return res.json(errorResponse); }
    User.findById({_id: req.user._id}, function(err, user) {
      if (err || !user) { return res.json(errorResponse); }
      user.email = req.body.newEmail;
      user.save(function(err, user) {
        if (err || !user) { return res.json(errorResponse); }
        res.json({
          isAuthenticated: true,
          username: user.username,
          name: user.name,
          email: user.email,
          orgs: user.orgs,
          isAdmin: user.isAdmin
        });
      });
    })
  },
  /**
   * Change a user's real name.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The authenticated user.
   * @param {ObjectID} req.user._id The ObjectID string of the user.
   * @param {string} req.user.username The username of the user.
   * @param {string} req.user.name The real name of the user.
   * @param {string} req.user.email The email address of the user.
   * @param {ObjectID[]} req.user.orgs The orgs of which the user is an owner.
   * @param {boolean} req.user.isAdmin Whether the user is an admin.
   * @param {object} req.body The request data sent by the client.
   * @param {string} req.body.newName The new real name for the user.
   * @param {object} res The HTTP response to be sent.
   */
  changeName: function(req, res) {
    newName = req.body.newName;
    var errorResponse = {
      isAuthenticated: true,
      username: req.user.username,
      name: req.user.name,
      email: req.user.email,
      orgs: req.user.orgs,
      isAdmin: req.user.isAdmin
    };
    if (!validation.name(newName)) { return res.json(errorResponse); }
    User.findById({_id: req.user._id}, function(err, user) {
      if (err || !user) { return res.json(errorResponse); }
      user.name = req.body.newName.trim();
      user.save(function(err, user) {
        if (err || !user) { return res.json(errorResponse); }
        res.json({
          isAuthenticated: true,
          username: user.username,
          name: user.name,
          email: user.email,
          orgs: user.orgs,
          isAdmin: user.isAdmin
        });
      });
    })
  },
  /**
   * Change a user's password.
   * @param {object} req The HTTP request being handled.
   * @param {object} req.user The authenticated user.
   * @param {ObjectID} req.user._id The ObjectID string of the user.
   * @param {object} req.body The request data sent by the client.
   * @param {string} req.body.newPassword The new password for the user.
   * @param {object} res The HTTP response to be sent.
   */
  changePassword: function(req, res) {
    newPassword = req.body.newPassword;
    var errorResponse = {
      isSuccessful: false, 
      isAuthenticated: true,
      error: 'Invalid new password.'
    };
    if (!validation.password(newPassword)) { return res.json(errorResponse); }
    User.findById({_id: req.user._id}, function(err, user) {
      if (err || !user) { return res.json(errorResponse); }
      User.generateHash(newPassword).then(function(hash) {
        user.password = hash;
        user.save(function(err, user) {
          if (err || !user) { return res.json(errorResponse); }
          res.json({ isSuccessful: true, isAuthenticated: true });
        });
      });
    })
  }
};

/**
 * A generic route callback type often called by authentication methods.
 * @callback nextRoute
 * @param {Object} req An Object representing the http request.
 * @param {Object} res An Object representing the http response.
 */