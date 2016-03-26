var express = require('express');
var mongoose = require('mongoose');
var Org = require('../models/orgModel');
var User = require('../models/userModel');

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

  },
  editRecord: function(req, res) {

  },
  voidRecord: function(req, res) {

  }
};

module.exports = routes;