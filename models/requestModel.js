// models/requestModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed    = mongoose.Schema.Types.Mixed;

var Request = mongoose.Schema({
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'transfer', 'revenue']
  },
  value: {
    type: Number,
    required: true
  },
  org: {
    type: ObjectId,
    required: true
  },
  details: {
    type: Mixed,
    required: true,
    default: {}
  },
  isActive: {
    type: Boolean,
    required: true
  },
  approvals: {
    type: [ObjectId],
    required: true,
    default: []
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model("requests", Request);