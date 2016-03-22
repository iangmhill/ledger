/*
  Ledger: A web application for tracking the funds and transactions of the Olin
  College Student Government.

  Authors: Zhecan "James" Wang, Ziyi "Jason" Lan, Ian Hill
*/ 

// MODULE IMPORTS ==============================================================

// environment variable modules
var dotenv         = require('dotenv');

// utility modules
var path           = require('path');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');

// express modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');

// database modules
var mongoose       = require('mongoose');

// route modules
var routes         = require('./routes/routes');

// authentication modules
var authentication = require('./authentication.js');
var session        = require('express-session');
var MongoStore     = require('connect-mongo')(session);

// CONFIGURATION ===============================================================

// load environment variables from .env file
dotenv.config();

// configure middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CONNECT TO DATABASE =========================================================
mongoose.connect(process.env.MONGODB);

// SECURITY CONFIGURATION ======================================================
var passport = authentication.configure();
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// ROUTES ======================================================================

// GET requests
app.get('/api/getOrgs', authentication.checkAuthentication, routes.getOrgs);
app.get('/api/getUserPermissions', authentication.getUserPermissions)
app.get('/logout', authentication.logout);
// POST requests
app.post('/api/createAllocation', authentication.checkAuthentication, routes.createAllocation);
app.post('/login', authentication.login);
app.post('/signup', authentication.signup);
// AngularJS requests
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

// START SERVER ================================================================
app.listen(process.env.PORT, function() {
  console.log("Ledger running on port:", process.env.PORT);
});