// models/allocationModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Allocation = mongoose.Schema({
  date: {
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
  spent: {
    type: Number,
    required: true
  },
  org: {
    type: ObjectId,
    required: true
  },
  records: {
    type: [ObjectId],
    required: true,
    default: []
  },
  isActive: {
    type: Boolean,
    required: true
  },
});

module.exports = mongoose.model("allocations", Allocation);