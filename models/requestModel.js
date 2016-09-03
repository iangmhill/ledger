// models/requestModel.js
var mongoose  = require('mongoose');
var ObjectId  = mongoose.Schema.Types.ObjectId;
var Mixed     = mongoose.Schema.Types.Mixed;
var constants = require('../utilities/constants');

var Item = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: constants.itemCategories
  }
});

var Link = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
});

var Request = mongoose.Schema({
  user: {
    type: ObjectId,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  remaining: {
    type: Number,
    required: true
  },
  org: {
    type: ObjectId,
    ref: 'orgs',
    required: true
  },
  links: {
    type: [Link],
    required: false
  },
  items: {
    type: [Item],
    required: false
  },
  isActive: {
    type: Boolean,
    required: true
  },
  approvals: {
    type: [ObjectId],
    ref: 'users',
    required: false,
    default: []
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  isDecided: {
    type: Boolean,
    required: true,
    default: false
  },
  comment: {
    type: [ObjectId],
    ref: 'comments',
    required: false,
    default: []
  }
});

module.exports = mongoose.model("requests", Request);

