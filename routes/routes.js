var express = require('express');
var mongoose = require('mongoose');
var Org = require('../models/orgModel');
var User = require('../models/userModel');
var Record = require('../models/recordModel');
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