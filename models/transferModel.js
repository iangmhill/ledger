// models/transferModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Transfer = mongoose.Schema({
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
    required: true,
    // default: "test"
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
    ref: 'Org',
    required: true
  },
  from: {
    type: ObjectId,
    ref: 'Org',
    required: true
  },
  approvals: {
    type: [ObjectId],
    ref: 'User',
    required: false,
    default: []
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  }
});

module.exports = mongoose.model("transfers", Transfer);

