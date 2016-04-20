/**
 * @fileOverview Server.js defines the external modules used server-side for
 * Ledger, defines server routes, and initializes Express and MongoDB.
 *
 * @version    0.0.1
 *
 * @author     Zhecan "James" Wang
 * @author     Ziyi "Jason" Lan
 * @author     Ian Hill
 *
 * @requires   NPM:dotenv
 * @requires   NPM:path
 * @requires   NPM:morgan
 * @requires   NPM:cookie-parser
 * @requires   NPM:q
 * @requires   NPM:express
 * @requires   NPM:body-parser
 * @requires   NPM:mongoose
 * @requires   NPM:express-session
 * @requires   NPM:connect-mongo
 * @requires   NPM:less-middleware
 * @requires   routes/routes
 * @requires   ultilities/startup
 * @requires   authentication
 */

// MODULE IMPORTS ==============================================================

// environment variable modules
var dotenv         = require('dotenv');

// utility modules
var path           = require('path');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var q              = require('q');

// express modules
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');

// database modules
var mongoose       = require('mongoose');

// route modules
var routes         = require('./routes/routes');

// authentication modules
var authentication = require('./authentication');
var session        = require('express-session');
var MongoStore     = require('connect-mongo')(session);

// startup modules
var startup        = require('./utilities/startup');

// less transpiler
var lessMiddleware = require('less-middleware');

// CONFIGURATION ===============================================================

// load environment variables from .env file
dotenv.config();

// configure middleware
var pathRoot = path.join(__dirname, 'public');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware('/stylesheets', {
  compress: true,
  pathRoot: pathRoot
}));
app.use(express.static(pathRoot));

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
// authentication GET requests
app.get('/logout', authentication.logout);
app.get('/api/getUserPermissions', authentication.getUserPermissions)
// user GET requests
app.get('/api/getUserList',
    authentication.authenticateUser, routes.getUserList);
app.get('/auth/getPendingUsers',
    authentication.authenticateAdmin, authentication.getPendingUsers);
app.get('/api/getUserOrgs',
    authentication.authenticateUser, routes.getUserOrgs);
// org GET requests
app.get('/api/getListedOrgs',
    authentication.authenticateUser, routes.getListedOrgs);
app.get('/api/getOrgByUrl/:url',
    authentication.authenticateUser, routes.getOrgByUrl);
app.get('/api/getOrgFinances',
    authentication.authenticateOwner, routes.getOrgFinances);
// request GET requests
app.get('/api/getOrgRequests',
    authentication.authenticateUser, routes.getOrgRequests);

app.get('/api/getUserRequests',
    authentication.authenticateUser, routes.getUserRequests);
// record GET requests
app.get('/api/getOrgRecords',
    authentication.authenticateOwner, routes.getOrgRecords);

app.get('/api/getUserRecords',
    authentication.authenticateUser, routes.getUserRecords);

// POST requests
// authentication POST requests
app.post('/login', authentication.login);
app.post('/checkUniqueUsername', authentication.checkUniqueUsername);
app.post('/register', authentication.register);
app.post('/changeEmail',
    authentication.authenticateUser, authentication.changeEmail);
app.post('/changeName',
    authentication.authenticateUser, authentication.changeName);
app.post('/changePassword',
    authentication.authenticateUser,
    authentication.confirmPassword,
    authentication.changePassword);
// user POST requests
app.post('/api/changeOwnership',
    authentication.authenticateAdmin, routes.changeOwnership);
app.post('/auth/resolveUser',
    authentication.authenticateAdmin, authentication.resolveUser);
// org POST requests
app.post('/api/createOrg',
    authentication.authenticateOwner, routes.createOrg);
app.post('/api/changeOwner',
    authentication.authenticateUser, routes.changeOwner);
app.post('/api/editOrg',
    authentication.authenticateOwner, routes.editOrg);
app.post('/api/deleteOrg',
    authentication.authenticateOwner, routes.deleteOrg);
// requests POST requests
app.post('/api/createRequest',
    authentication.authenticateUser, routes.createRequest);
app.post('/api/approveRequest',
    authentication.authenticateOwner, routes.approveRequest);
app.post('/api/closeRequest',
    authentication.authenticateOwner, routes.closeRequest);
// record POST requests
app.post('/api/createRecord',
    authentication.authenticateUser, routes.createRecord);
app.post('/api/editRecord',
    authentication.authenticateOwner, routes.editRecord);
app.post('/api/voidRecord',
    authentication.authenticateOwner, routes.voidRecord);

// AngularJS requests
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
// INITIALIZE DATABASE AND DEFAULT ADMIN USER ==================================
var initialize = startup.initialize();

// START SERVER ================================================================
initialize.then(function(err) {
  if (!err) {
    app.listen(process.env.PORT, function() {
      console.log('Ledger running on port:', process.env.PORT);
    });
  } else {
    console.log('STARTUP ERROR: ' + err);
  }
});

