// models/requestModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed    = mongoose.Schema.Types.Mixed;

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
  org: {
    type: ObjectId,
    ref: 'orgs',
    required: true
  },
  online: {
    type: Array
  },
  specification: {
    type: Array,
    required: true
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
  inApproved: {
    type: Boolean,
    required: true,
    default: true
  }
});

module.exports = mongoose.model("requests", Request);

