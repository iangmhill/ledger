/**
 * Route module
 * @module routes
 * @requires NPM:express
 * @requires NPM:mongoose
 * @requires models/orgModel
 * @requires models/userModel
 * @requires models/requestModel
 * @requires models/transferModel
 * @requires models/recordModel
 * @requires NPM:q
 * @requires utilities/validation
 * @requires NPM: async
 */

var express    = require('express');
var mongoose   = require('mongoose');
var Org        = require('../models/orgModel');
var User       = require('../models/userModel');
var Request    = require('../models/requestModel');
var Transfer   = require('../models/transferModel');
var Record     = require('../models/recordModel').record;
var Purchase   = require('../models/recordModel').purchase;
var Revenue    = require('../models/recordModel').revenue;
var q          = require('q');
var validation = require('../utilities/validation');
var sendgrid   = require('sendgrid')(process.env.EMAIL);
var async      = require('async');


var evaluateApprovals = function(approvalProcess, owners, approvals) {
  switch (approvalProcess) {
    case 'strict':
      for (index in owners) {
        if (approvals.indexOf(owners[index]) == -1) { return false; }
      }
      return true;
    case 'onlyone':
      for (index in approvals) {
        console.log(owners);
        console.log(approvals[index]);
        if (owners.indexOf(approvals[index]) > -1) { return true; }
      }
      return false;
    case 'none':
      return true;
    default:
      return false;
  }
};

var routes = {
  /**
  * Get all the users' name from database.
  * @return {array} An array of all the user objects in database.
  * @param {object} req The HTTP request being handled.
  * @param {object} res The HTTP response to be sent.
  */
  getUserList: function(req, res) {
    User.find({}, 'username name', function(err, users) {
      res.json(users);
    })
  },

  /**
  * Get all orgs under users' control from database.
  * @param {object} req The HTTP request being handled.
  * @param {object} res The HTTP response to be sent.
  * @param {object} req.user.orgs an array of users' orgs.
  */
  getUserOrgs: function(req, res) {
  /**
  * Merge two arrays together.
  * @param {object} array1 An array of objects.
  * @param {object} array2 An array of objects.
  * @return {array} An array of all the merged objects.
  */
    function mergeArray(array1, array2) {
      for(item in array1) {
        array2[item] = array1[item];
      }
      return array2;
    };
      /**
  * Recursively get the childrean organizations.
  * @param {object} ids An array of org Object IDs.
  */
    function recursiveFind(ids) {
      var deferred = q.defer();
      var children = {};
      var nextIds = [];
      Org.find({parent: {$in: ids}}, function(err, orgs) {

        if (orgs.length > 0) {
          for (index in orgs) {
            children[orgs[index]._id] = orgs[index].toObject();
            children[orgs[index]._id].owners = [];
            nextIds.push(orgs[index]._id);
          }
        }
        if (nextIds.length > 0) {
          recursiveFind(nextIds).then(function(childrensChildren) {
            deferred.resolve(mergeArray(children,childrensChildren));
          })
        } else {
          deferred.resolve(children);
        }
      })
      return deferred.promise;
    };
    Org.find({_id:{ $in: req.user.orgs}}, function(err, rootOrgs) {
      var roots = {};
      for (index in rootOrgs) {
        roots[rootOrgs[index]._id] = rootOrgs[index].toObject();
        roots[rootOrgs[index]._id].owners = [];
      }
      recursiveFind(req.user.orgs).then(function(children) {
        var allOrgs = mergeArray(children, roots);
        User.find({orgs:{ $in: Object.keys(allOrgs)}}, function(err, users) {

          for (userIndex in users) {
            for (idIndex in users[userIndex].orgs) {
              if (Object.keys(allOrgs).indexOf(users[userIndex].orgs[idIndex].toString()) > -1) {
                allOrgs[users[userIndex].orgs[idIndex]].owners.push(users[userIndex]);
              }
            }
          }
          res.json({
            roots: req.user.orgs,
            orgs: allOrgs
          });
        });
      })
    })
  },

  /**
  * Get all the active orgs.
  * @param {object} req The HTTP request being handled.
  * @param {object} res The HTTP response to be sent.
  */
  getListedOrgs: function(req, res) {
    Org.find({isActive: true}, 'name shortName url budgeted nonterminal',
        function(err, orgs) {
      res.status(200).json(orgs);
    })
  },

  getOrgByUrl: function(req, res) {
    if (!typeof req.params.url === 'string') { res.json({isSuccessful: false}); }
    Org.findOne({url: req.params.url}, function(err, org) {
      User.find({orgs: org._id}, 'name username', function(err, users) {
        if (err || !users || !org) { res.json({isSuccessful: false}); }
        org = org.toObject();
        org.owners = users;
        if (org.budgeted) {
          Org.find({ $and: [{parent: org._id}, {budgeted: true}]},
              function(err, children) {
            if (err) { res.json({isSuccessful: false}); }
            Request.find({ $and: [{org: org._id},{isActive: true}]},
                function(err, requests) {
              if (err) { res.json({isSuccessful: false}); }
              var allocated = 0;
              for (index in requests) {
                allocated += requests[index].remaining;
              }
              for (index in children) {
                allocated += children[index].budget;
              }
              org.children = children ? children : [];
              org.allocated = allocated;
              res.json({
                isSuccessful: true,
                isAuthorized:
                    (req.user.orgs.indexOf(org._id) > -1 || req.user.isAdmin),
                org: (req.user.orgs.indexOf(org._id) > -1 || req.user.isAdmin)
                    ? org
                    : undefined
              });
            })
          })
        } else {
          res.json({
            isSuccessful: true,
            isAuthorized:
                (req.user.orgs.indexOf(org._id) > -1 || req.user.isAdmin),
            org: (req.user.orgs.indexOf(org._id) > -1 || req.user.isAdmin)
                ? org
                : undefined
          });
        }

      });

    });
  },
  getOrgFinances: function(req, res) {

  },
  /**
  * Get all the requests in database
  * @param {object} req The HTTP request being handled.
  * @param {object} res The HTTP response to be sent.
  */
  getOrgRequests: function(req, res) {
    var orgid = req.params.id;
    var requestlist = [];
    Request.find({org:orgid},function (err, requestlist) {
    if (err) return console.error(err);
      res.json(requestlist);
    })
  },
  getUserRequests: function(req, res) {

  },
  getOrgRecords: function(req, res) {
    var orgid = req.params.id;
    console.log(orgid);
    var recordlist = [];
    Record.find({},function (err, recordlist) {
      if (err) return console.error(err);
      console.log("Record list: " + recordlist);
      res.json(recordlist);
    })
  },
  getUserRecords: function(req, res) {

  },
  changeOwnership: function(req, res) {

  },
  /**
  * Create an org in the database.
  * @param {Object} req The HTTP request being handled.
  * @param {Object} res The HTTP response to be sent.
  * @param {object} req.body.name The full name of the org.
  * @param {String} req.body.shortName The short name of the org.
  * @param {String} req.body.org The Object ID of the org's parent org.
  * @param {Float} req.body.budgeted The budget amoung of the org.
  * @param {Boolean} req.body.nonterminal The boolean value determines if the org is terminal.
  * @param {Array} req.body.approvalProcess An array of String of the approvers' names.
  */
  createOrg: function(req, res) {
    validation.org.org(req.body.name, req.body.shortName, req.body.org,
        req.body.budgeted, req.body.budget, req.body.nonterminal,
        req.body.approvalProcess).then(function(isValid) {

      if (isValid) {
        Org.create({
          name: req.body.name,
          url: req.body.name.toLowerCase().replace(/ /g,"_").replace(/\W/g, ''),
          shortName: req.body.shortName,
          parent: req.body.org,
          budgeted: req.body.budgeted,
          budget: req.body.budget,
          nonterminal: req.body.nonterminal,
          approvalProcess: req.body.approvalProcess
        }, function (err, org) {
          var org = org.toObject();
          org.owners = [];
          res.json({
            isSuccessful: !!org && !err,
            org: org
          });
        });
      } else {
        res.json({
          isSuccessful: false
        });
      }
    })
  },
  /**
  * Change the ownser of an org in the database.
  * @param {Object} req The HTTP request being handled.
  * @param {Object} res The HTTP response to be sent.
  * @param {Boolean} req.user.isAdmin The boolean value indicates if the user is an admin account.
  * @param {Array} req.user.orgs An array holds Object IDs of all the orgs under the user's control.
  * @param {String} req.body.username The usersame of the target user.
  * @param {Boolean} req.body.action The boolean value indicates if the org should be transfered to the user or not.
  */
  changeOwner: function(req, res) {
    var orgId = req.body.orgId;
    if (!req.user.isAdmin && !req.user.orgs.indexOf(orgId) > -1) {
      return res.json({isSuccessful: false});
    }
    User.findOne({username: req.body.username}, 'name username orgs',
        function(err, user) {
      if (err || !user) { return res.json({isSuccessful: false}); }
      if (req.body.action) {
        // Add owner
        if (user.orgs.indexOf(orgId) == -1) { user.orgs.push(orgId); }
        user.save(function(err) {
          if (err) { res.json({isSuccessful: false}); }
          var cleanUser = user.toObject();
          delete cleanUser['orgs'];
          res.json({
            isSuccessful: true,
            user: cleanUser
          });
        })
      } else {
        // Remove owner
        user.orgs.splice(user.orgs.indexOf(orgId), 1);
        user.save(function(err) {
          if (err) { res.json({isSuccessful: false}); }
          res.json({
            isSuccessful: true
          });
        })
      }
    })
  },
  createTransfer: function(req, res) {
    validation.transfer.transfer(
      req.body.org,
      req.body.to,
      req.body.from,
      req.body.value,
      req.body.justification
    ).then(function(isValid) {
      if (isValid) {
        Org.findById(req.body.from, function(err, org) {
          User.find({orgs: req.body.from}, '', function(err, users) {
            var approvals = (req.user.orgs.indexOf(req.body.from) > -1)
                ? [req.user._id]
                : [];
            var owners = users.map(function(user) { return user._id; });
            var isApproved =
                evaluateApprovals(org.approvalProcess, owners, approvals);
            console.log(isApproved);
            Transfer.create({
              user: req.user.id,
              justification: req.body.justification,
              type: (req.body.to == req.body.org) ? 'budget' : 'transfer',
              value: req.body.value,
              to: req.body.to,
              from: req.body.from,
              approvals: approvals,
              isApproved: isApproved
            }, function (err, transfer) {
              res.json({
                isSuccessful: !err && !!transfer,
                org: org
              });
            });
          });
        });
      } else {
        res.json({
          isSuccessful: false
        });
      }
    })
  },
  getPendingTransfers: function(req, res) {
    Transfer.find({$and: [{from: req.params.org},{isApproved: false}]},
        function(err, transfers) {
      res.json({
        isSuccessful: !err && transfers,
        transfers: transfers
      });
    })
  },
  approveTransfer: function(req, res) {
  },
  editOrg: function(req, res) {

  },
  deleteOrg: function(req, res) {

  },
  /**
  * Create a request in the database.
  * @param {Object} req The HTTP request being handled.
  * @param {Object} res The HTTP response to be sent.
  * @param {String} req.user._id The user's Object ID.
  * @param {String} req.body.description The description of the request.
  * @param {Float} req.body.amount The amount of money that is requested.
  * @param {String} req.body.org The Object ID of the org this request is against to.
  * @param {Array} req.body.links An array of objects tha contain online order infos.
  * @param {Array} req.body.items An array of objects tha contain all item infos.
  */
  createRequest: function(req, res) {
    var request = {
      user: req.user._id,
      description: req.body.description,
      value: req.body.amount,
      remaining: req.body.amount,
      org: req.body.org,
      links: req.body.links,
      items: req.body.items,
      isActive: true,
      isApproved: false,
      isDecided: false,
      comment: ''
    };
    validation.request.request(
      request.description,
      request.value,
      request.org,
      request.links,
      request.items
    ).then(function(preapproved) {
      request.isApproved = preapproved;
      console.log(request);
      return Request.create(request);
    }).then(function(request) {
      res.send({ isSuccessful: true, request: request });
    }).catch(function(err) {
      console.log(err);
      res.send({
        isSuccessful: false,
        message: 'ERROR: Could not create request'
      });
    });
  },
  /**
  * Edit a request in the database.
  * @param {Object} req The HTTP request being handled.
  * @param {Object} res The HTTP response to be sent.
  * @param {String} req.body.request._id The request's Object ID.
  * @param {Boolean} req.body.request.isApproved The boolean value that indicates if the request is approved or not.
  */
  editRequest: function(req, res) {
    function confirm(err, request) {
      if (err) {
        console.log("I fail " + err)
        return res.send({
          success: false,
          message: 'ERROR:'
        });
      }
      return res.send({
        success: true,
      });
    }
    console.log(req.body);
    console.log(req.body._id);
    Request.findById(req.body._id, function(err, request) {
        if (err) {
          return res.send({
            success: false,
            message: 'ERROR: Could not edit request'
          });
        }
        console.log(request);
                console.log(req.body);

        request.description = req.body.description;
        request.value = req.body.value;
        request.remaining = req.body.value;
        request.links = req.body.links;
        request.items = req.body.items;
        request.approvals = req.body.approvals;
        request.isApproved = req.body.isApproved;
        request.isDecided = req.body.isDecided;
        request.isActive = req.body.isActive;
        request.comment = req.body.comment;

        request.save(confirm);
      });
  },
  /**
  * Get all the requests in the database.
  * @param {Object} req The HTTP request being handled.
  * @param {Object} res The HTTP response to be sent.
  * @param {String} req.params.user The user's Object ID.
  */
  getRequests: function(req, res) {
    var tasks = [];
    var id = mongoose.Types.ObjectId(req.params.user);
    var filteredRequests = [];

    Request.find({user: id, isActive: true}, function(err, requests) {
        if (err) {
          console.log("fail edit request" + err)
          return res.send({
            success: false,
            message: 'ERROR: Could not edit request'
          });
        }
        requests.forEach(function(request){
          tasks.push(function(callback){
            Org.find({_id: request.org}, function(err, orgs){
              var newRequest = JSON.parse(JSON.stringify(request));
              // newRequest.orgName = orgs[0].name;
              filteredRequests.push(newRequest);
              callback(null, null);
            })
          })
        })

        async.series(tasks, function(err, results){
          res.status(200).json({
            success: true,
            requests: filteredRequests
          });
        })
      });
  },
  closeRequest: function(req, res) {

  },
  createRecord: function(req, res) {
    function handleError(err) {
      console.log(err);
      res.send({
        isSuccessful: false,
        message: 'ERROR: Could not create request'
      });
    }
    function handleSuccess(record) {
      res.send({ isSuccessful: true, request: record });
    }
    function adjustBudget(orgId, value) {
      return new Promise(function(resolve,reject) {
        Org.findById(orgId).then(function(org) {
          if (org.budgeted) { org.budget += value; }
          org.save(function(err) {
            if (err) { return reject() }
            if (org.parent) {
              adjustBudget(org.parent, value).then(resolve,reject);
            } else {
              resolve();
            }
          })
        });
      });
    }
    function adjustRequest(requestId, value) {
      return new Promise(function(resolve,reject) {
        Request.findById(requestId).then(function(request) {
          request.remaining += value;
          request.save(function(err) {
            if (err) { return reject() }
            resolve();
          })
        });
      });
    }
    var record = {
      user: req.user._id,
      type: req.body.type,
      date: new Date(!!req.body.date ? req.body.date : false),
      description: req.body.description,
      value: req.body.value,
      org: req.body.org
    }
    switch (record.type) {
      case 'purchase':
        record.request = req.body.request;
        record.paymentMethod = req.body.paymentMethod;
        record.pcard = req.body.pcard;
        record.items = req.body.items;
        validation.record.purchase(record.date, record.description,
            record.value, record.org, record.request, record.paymentMethod,
            record.pcard, record.items).then(function() {
          return adjustBudget(record.org, -record.value);
        })
        .then(function() {
          return adjustRequest(record.request, -record.value);
        })
        .then(function() {
          return Purchase.create(record);
        }).then(handleSuccess)
        .catch(handleError);
        break;
      case 'revenue':
        validation.record.revenue(record.date, record.description, record.value,
            record.org).then(function() {
          return adjustBudget(record.org, record.value);
        })
        .then(function() {
          return Revenue.create(record);
        })
        .then(handleSuccess)
        .catch(handleError);
        break;
      default:
        handleError('Invalid record type');
    }
  },
  editRecord: function(req, res) {

  },
  voidRecord: function(req, res) {

  },
  sendRegEmail: function(req, res){
    console.log("got to email");
    var email = req.params.email;
    console.log(email);
    var payload   = {
        to      :  email,
        from    : 'DONT.REPLY@ledger.com',
        subject : 'Successful registration for ledger',
        text    : 'Congradualtions! You are successfully registered for ledger. Go and check it out!'
    }
    sendgrid.send(payload, function(err, json) {
      if (err) { console.error(err); }
        console.log(json);
    });
  },

  sendReqEmail: function(req, res){
    console.log("got to email");
    var email = req.params.email;
    console.log(email);
    var payload   = {
        to      :  email,
        from    : 'DONT.REPLY@ledger.com',
        subject : 'Your fund request',
        text    : 'The purchase request you submitted has been updated. Go check it out!'
    }
    sendgrid.send(payload, function(err, json) {
      if (err) { console.error(err); }
        console.log(json);
    });
  },

  /**
   * Get an array of all the pending funding requests.
   * @param {object} req The HTTP request being handled.
   * @param {object} res The HTTP response to be sent.
   * @param {object} req.user.orgs The authenticated user's organizations.
   */
  getPendingFundRequests: function(req, res){

    var errorResponse = {
      pendingFundRequests: []
    };

    // console.log("routes, getPendingFundRequests");
    var orgs = req.user.orgs;
    var filteredOrgs = [];
    var pendingRequests = [];
    var tasks = []
    var budgetedNonterminal = []
    var requestsUserId = [];
    var filtedPendingRequests = [];


    Org.find({_id:{$in: orgs}}, function(err,orgs){
      // console.log("find org");

      orgs.forEach(function(org){
          // console.log(org.name);
          if(org.budgeted){
            // console.log("is budgeted");
            if(org.nonterminal){
              // console.log("nonterminal");
              budgetedNonterminal.push(org._id);
            }else{
              // console.log("terminal");
            }
            filteredOrgs.push(org._id);
          }

      })

      // console.log("filteredOrgs: ");
      // console.log(filteredOrgs);
      // console.log("budgetedNonterminal: ");
      // console.log(budgetedNonterminal);

      budgetedNonterminal.forEach(function(pOrg){
        tasks.push(function(callback){
          // console.log("parent: ");
          // console.log(pOrg);
          Org.find({parent: pOrg, budgeted: false}, function(err,orgs){
            if(orgs.length > 0){
              orgs.forEach(function(org){
                // console.log("find children");
                // console.log(org.name);
                filteredOrgs.push(org._id);
                callback(null, null);
              })
            }else{
                // console.log("no children!!!!!");
                callback(null, null);
            }

          })
        })
      })

      async.series(tasks, function(err, results){

        // console.log("second round");
        // console.log("filteredOrgs: ");
        console.log(filteredOrgs);
        // console.log("budgetedNonterminal: ");
        console.log(budgetedNonterminal);

        Request.find({org:{$in: filteredOrgs}, isActive: true, isDecided: false}, function(err, requests){
          if (err || !requests) { return res.json(errorResponse); }
          requests.forEach(function(request){
            pendingRequests.push(request);
            // requestsUserId.push(request.user);
          })
          tasks = [];
          pendingRequests.forEach(function(request){
            tasks.push(function(callback){
              // console.log("request.user");
              // console.log(request.user);
              User.find({_id:request.user}, function(err, users){
                if (err || !users) { return res.json(errorResponse); }
                // console.log("find the user: ");
                // console.log(users[0].username);

                Org.find({_id: request.org}, function(err, orgs){
                  // console.log("find the org: ");
                  // console.log(orgs[0].name);
                    var newRequest = JSON.parse(JSON.stringify(request));
                    newRequest.username = users[0].username;
                    newRequest.orgname = orgs[0].name
                  filtedPendingRequests.push(newRequest);
                  callback(null, null);
                })
              })
            })
          })
          async.series(tasks, function(err, results){
            // console.log("filteredPendingRequests: ");
            // console.log(filtedPendingRequests);
            res.json({pendingFundRequests: filtedPendingRequests});
          })
        })
      })

    })
  }
};



module.exports = routes;