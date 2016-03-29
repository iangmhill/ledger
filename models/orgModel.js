// models/orgModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Org = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  budgeted: {
    type: Boolean,
    required: true
  },
  budget: {
    type: Number,
    required: false
  },
  terminal: {
    type: Boolean,
    required: true
  },
  parent: {
    type: ObjectId,
    required: false
  },
  children: {
    type: [ObjectId],
    required: false,
    default: []
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  approvalProcess: {
    type: String,
    required: true,
    enum: ['strict', 'onlyone', 'automatic'],
    default: 'strict'
  }
});

// Some org fields are conditionally required
Org.pre('save', function(next) {
  if (this.budgeted && !this.budget) {
    return next(new Error("Budgeted orgs must have a budget"));
  }
  if (this.terminal && this.children.length > 0) {
    return next(new Error("Terminal orgs cannot have children"));
  }
  next();
});

module.exports = mongoose.model("orgs", Org);