var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('./models/userModel');
var validation    = require('./utilities/validation');

var authentication = {
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
  authenticateUser: function(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.status(401).send();
  },
  authenticateOwner: function(req, res, next) {
    if (req.isAuthenticated() && (req.user.orgs.indexOf(req.body.org) > -1)) {
      return next();
    }
    res.status(401).send();
  },
  authenticateAdmin: function(req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin) { return next(); }
    res.status(401).send();
  },
  register: function(req, res, next) {
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
  checkUniqueUsername: function(req, res) {
    validation.username(req.body.username).then(function(isValid) {
      res.json({ isUnique: isValid });
    })
  },
  login: function(req, res, next) {
    passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/login'
    })(req, res, next);
  },
  logout: function(req, res){
    req.logout();
    res.redirect('/login');
  },
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
  confirmPassword: function(req, res, next) {
    var password = req.body.password;
    var errorResponse = {
      isSuccessful: false,
      isAuthenticated: false,
      error: 'Invalid password.'
    };
    if (!validation.password(password)) { return res.json(errorResponse); }
    User.findOne({ 'username' :  req.user.username }, function(err, user) {
      if (err) { return next(err); };
      if (!user) { return res.json(errorResponse); }
      user.validPassword(req.body.password).then(function(isValid) {
        if (!isValid) { return res.json(errorResponse); }
        return next();
      }); 
    });
  },
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

module.exports = authentication;