var express = require('express');
var mongoose = require('mongoose');
var Org = require('../models/orgModel');
var User = require('../models/userModel');
var Request = require('../models/requestModel');
var validation    = require('../utilities/validation');

var routes = {
  getUserList: function(req, res) {
    User.find({}, {password: 0}, function(err, users) {
      res.json(users);
    })
  },
  getUserOrgs: function(req, res) {

  },
  getListedOrgs: function(req, res) {

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
    validation.request(
      data.description, 
      data.type, 
      data.value, 
      data.org, 
      data.details, 
      data.online, 
      data.specification
    ).then(function(isValid) {
      console.log("request then function");
      if (!isValid) { 
        console.log("request data is InValid");
        return res.json(errorResponse); }
      console.log("request data is valid");
      Request.create(data, confirm);
    })
  },
  approveRequest: function(req, res) {

  },
  closeRequest: function(req, res) {

  },
  createRecord: function(req, res) {

  },
  editRecord: function(req, res) {

  },
  voidRecord: function(req, res) {

  }
};

module.exports = routes;