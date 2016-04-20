
var express    = require('express');
var mongoose   = require('mongoose');
var Org        = require('../models/orgModel');
var User       = require('../models/userModel');
var Request    = require('../models/requestModel');
var Transfer   = require('../models/transferModel');
var q          = require('q');
var validation = require('../utilities/validation');

var evaluateApprovals = function(approvalProcess, owners, approvals) {
  switch (approvalProcess) {
    case 'strict':
      for (index in owners) {
        if (approvals.indexOf(owners[index]) == -1) { return false; }
      }
      return true;
    case 'onlyone':
      for (index in approvals) {
        if (owners.indexOf(approvals[index]) > -1) { return true; }
      }
    case 'none':
      return true;
    default:
      return false;
  }
};

var routes = {
  getUserList: function(req, res) {
    User.find({}, 'username name', function(err, users) {
      res.json(users);
    })
  },
  getUserOrgs: function(req, res) {
    function mergeArray(array1, array2) {
      for(item in array1) {
        array2[item] = array1[item];
      }
      return array2;
    };
    function recursiveFind(ids) {
      var deferred = q.defer();
      var children = {};
      var nextIds = [];
      Org.find({parent:ids[0]}, function(err, orgs) {

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
              allOrgs[users[userIndex].orgs[idIndex]].owners.push(users[userIndex]);
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
                allocated += requests[index].value;
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
  getOrgRequests: function(req, res) {

  },
  getUserRequests: function(req, res) {

  },
  getOrgRecords: function(req, res) {

  },
  getUserRecords: function(req, res) {

  },
  changeOwnership: function(req, res) {

  },
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
  approveTransfer: function(req, res) {
    console.log(req.body);
  },
  editOrg: function(req, res) {

  },
  deleteOrg: function(req, res) {

  },
  createRequest: function(req, res) {
    function confirm(err, request) {
      if (err) {
        console.log("I failrew" + err)
        return res.send({
          success: false,
          message: 'ERROR: Could not create topic'
        });
      }
      return res.send({
        success: true,
      });
    }
    // console.log("req.body: " + req.body);
    // console.log("user id: " + req.user._id);

    var data = {
              user: req.user._id,
              description: req.body.description,
              type: req.body.type,
              value: req.body.amount,
              org: req.body.organization,
              details: req.body.details,
              online: req.body.online,
              specification: req.body.specification,
              isActive: false,
              isApproved: false
            }
    var errorResponse = { isSuccessful: false, isValid: false };
    console.log("server request ");
    console.log(validation);
    if (!validation.request.request(
      data.description,
      data.type,
      data.value,
      data.org,
      data.details,
      data.online,
      data.specification
    )) {
      return res.json(errorResponse);
    }
    console.log("request org: " +  data.org);
    validation.org.getInfo(data.org).then(function (orgData){
      data.org = orgData.id;
      console.log("request org: " +  orgData.id);
      if(orgData.approval){
        data.isApproved = true;
      }
      else{
        data.isApproved = false;
      }
      console.log("data.isApproved: " + data.isApproved);
      Request.create(data, confirm);
    });
  },
  approveRequest: function(req, res) {

  },
  closeRequest: function(req, res) {

  },
  createRecord: function(req, res) {
    function confirm(err, request) {
      if (err) {
        console.log("fail recording" + err)
        return res.send({
          success: false,
          message: 'ERROR: Could not create record'
        });
      }
      console.log("success!")
      return res.send({
        success: true,
      });
    }

    var data = {
          user: req.user._id,
          type: req.body.type,
          occurred: req.body.occurred,
          paymentMethod: req.body.paymentMethod,
          request: req.body.request,
          value: req.body.value,
          details: req.body.details,
          org: req.body.org,
          void: req.body.void
          }

    var errorResponse = { isSuccessful: false, isValid: false };
    console.log("server request ");
    validation.record(
      data.type,
      // data.value,
      data.paymentMethod,
      data.value,
      data.details,
      data.org
    ).then(function(isValid) {
      console.log("got here");
      if (!isValid) { return res.json(errorResponse); }
      console.log("record then function");
      Record.create(data, confirm);
    })
  },
  editRecord: function(req, res) {

  },
  voidRecord: function(req, res) {

  },
  getRecords: function(req, res){

  }
};

module.exports = routes;