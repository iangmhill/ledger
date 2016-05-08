// models/transferModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Transfer = mongoose.Schema({
  user: {
    type: ObjectId,
    ref: 'users',
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  justification: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['transfer', 'budget'],
    default: 'budget'
  },
  value: {
    type: Number,
    required: true,
  },
  to: {
    type: ObjectId,
    ref: 'orgs',
    required: true
  },
  from: {
    type: ObjectId,
    ref: 'orgs',
    required: true
  },
  response: {
    type: String,
    required: false
  },
  approvedValue: {
    type: Number,
    required: false
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
  }
});

module.exports = mongoose.model("transfers", Transfer);

