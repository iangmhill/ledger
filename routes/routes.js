
var express    = require('express');
var mongoose   = require('mongoose');
var Org        = require('../models/orgModel');
var User       = require('../models/userModel');
var Request    = require('../models/requestModel');
var Record     = require('../models/recordModel');
var q          = require('q');
var validation = require('../utilities/validation');


var routes = {
  getUserList: function(req, res) {
    User.find({}, {password: 0}, function(err, users) {
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
    // Request.find().remove().exec();
    var clean_orgs = []
    Org.find(function(err, orgs) {
      // console.log(orgs);
      orgs.forEach(function(org){
        clean_orgs.push({name: org.name, id: org._id});
      })
      console.log(clean_orgs);
      res.status(200).json(orgs);
    })
  },
  getOrgFinances: function(req, res) {

  },
  getOrgRequests: function(req, res) {
    var requestlist = [];
    Request.find({},function (err, requestlist) {
    if (err) return console.error(err);
      res.json(requestlist);
    })
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
      // console.log("request data is InValid");
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
    function confirm(err, record) {
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
    if(validation.record(data.type, data.paymentMethod, data.value, data.details)){    
        Record.create(data, confirm);
    } else { return res.json(errorResponse); }
  },
  editRecord: function(req, res) {

  },
  voidRecord: function(req, res) {

  },
  getRecords: function(req, res){
    
  }
};

module.exports = routes;