var express = require('express');
var mongoose = require('mongoose');
var Allocation = require('../models/allocationModel');
var Org = require('../models/orgModel');
var User = require('../models/userModel');

var routes = {
  createAllocation: function(req, res) {
    var value = req.body.value;
    var description = req.body.description;
    var id = req.body.org;
    Org.findById(id, function(err, org) {
      if (org.isActive === false) {
        console.log('ERROR: Invalid organization name');
        res.send({
          success: false,
          error: 'allocation creation failed'}
        );
        return;
      }
      var allocation = new Allocation({
        description: description,
        value: value,
        spent: 0,
        org: org._id,
        isActive: true
      });
      console.log(allocation);
      allocation.save(function(err) {
        if (err) {
          console.log('ERROR: Invalid allocation parameters');
          res.send({
            success: false,
            message: 'ERROR: Invalid allocation parameters'
          });
          return;
        }
        console.log(org);
        res.send({
          success: true,
          date: allocation.date.toString().substring(0,24),
          org: org.name,
          value: allocation.value,
          description: allocation.description
        });
      });
    });
  },
  getOrgs: function(req, res) {
    Org.find({}, function(err, orgs) {
      if (err) {
        console.log("ERROR: Cannot retrieve orgs")
        res.json([]);
      }
      console.log(orgs);
      res.json(orgs);
    });
  }
};

module.exports = routes;