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
    required: true,
    // default: "test"
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'transfer', 'revenue'],
    default: "expense"
  },
  value: {
    type: Number,
    required: true,
    // default: 100
  },
  org: {
    // type: String,
    type: ObjectId,
    required: true
    // default: "SAO"
  },
  details: {
    type: String, 
    // type: Mixed,
    required: true,
    // default: {}
    default: ""
  },
  online: {
    type: Array
  },
  specification: {
    type: Array,
    required: true,
    // default: ["test"]
  },
  isActive: {
    type: Boolean,
    required: true
  },
  approvals: {
    type: [ObjectId],
    // required: true,
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

