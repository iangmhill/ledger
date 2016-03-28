var validator     = require('validator');
var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User          = require('./models/userModel.js');

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
    passport.use('local-signup', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback : true
    },
    function(req, username, password, done) {
      process.nextTick(function() {
        User.findOne({ 'username':  username }, function(err, user) {
          if (err) { return done(err); }
          if (user) {
            return done(null, false);
          } else {
            var newUser = new User();
            newUser.username = username;
            passwordPromise = newUser.generateHash(password);
            passwordPromise.then(function(hash) {
              newUser.password = hash;
              newUser.email = req.body.email;
              newUser.name = req.body.name;
              newUser.save(function(err) {
                if (err) { throw err; }
                return done(null, newUser);
              });
            });
          }
        });    
      });
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback : true
    },
    function(req, username, password, done) {
      User.findOne({ 'username' :  username }, function(err, user) {
        if (err) { return done(err); };
        if (!user) { return done(null, false); }
        validationPromise = user.validPassword(password);

        validationPromise.then(function(isValid) {
          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false);
          }
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
  signup: function(req, res, next) {
    passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/signup'
    })(req, res, next);
  },
  checkUniqueUsername: function(req, res) {
    User.find({username: req.body.username}, function(err, users) {
      res.json({
        isUnique: (users.length == 0)
      });
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
    var errorResponse = {
      success: false,
      isAuthenticated: false,
      error: 'Wrong password.'
    };
    var password = req.body.password;
    if (typeof password === 'string') {
      User.findOne({ 'username' :  req.user.username }, function(err, user) {
        if (err) { return res.json(errorResponse); };
        if (!user) { return res.json(errorResponse); }
        user.validPassword(req.body.password).then(function(isValid) {
          if (!isValid) { return res.json(errorResponse); }
          return next();
        }); 
      });
    }
  },
  changeEmail: function(req, res) {
    newEmail = req.body.newEmail;
    if (typeof newEmail === 'string' && validator.isEmail(newEmail)) {
      User.findById({_id: req.user._id}, function(err, user) {
        user.email = req.body.newEmail;
        user.save(function(err, user) {
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
    } else {
      res.json({
        isAuthenticated: true,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        orgs: req.user.orgs,
        isAdmin: req.user.isAdmin
      });
    }
  },
  changeName: function(req, res) {
    newName = req.body.newName;
    console.log(newName);
    if (typeof newName === 'string' && newName.trim().length > 0) {
      newName = newName.trim();
      User.findById({_id: req.user._id}, function(err, user) {
        user.name = req.body.newName;
        user.save(function(err, user) {
          if (err) {
            return res.json({
              isAuthenticated: true,
              username: req.user.username,
              name: req.user.name,
              email: req.user.email,
              orgs: req.user.orgs,
              isAdmin: req.user.isAdmin
            });
          }
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
    } else {
      res.json({
        isAuthenticated: true,
        username: req.user.username,
        name: req.user.name,
        email: req.user.email,
        orgs: req.user.orgs,
        isAdmin: req.user.isAdmin
      });
    }
  },
  changePassword: function(req, res) {
    newPassword = req.body.newPassword;
    if (typeof newPassword === 'string') {
      User.findById({_id: req.user._id}, function(err, user) {
        User.generateHash(newPassword).then(function(hash) {
          user.password = hash;
          user.save(function(err, user) {
            res.json({ success: true, isAuthenticated: true });
          });
        });
      })
    } else {
      res.json({
        success: false, 
        isAuthenticated: true,
        error: 'Invalid new password.'});
    }
  }

};

module.exports = authentication;