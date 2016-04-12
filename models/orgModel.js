// models/orgModel.js
var mongoose  = require('mongoose');
var ObjectId  = mongoose.Schema.Types.ObjectId;
var constants = require('../utilities/constants');

var Org = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  shortName: {
    type: String,
    required: false
  },
  budgeted: {
    type: Boolean,
    required: true
  },
  budget: {
    type: Number,
    required: false
  },
  nonterminal: {
    type: Boolean,
    required: true
  },
  parent: {
    type: ObjectId,
    ref: 'Org',
    required: false
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
    enum: constants.approvalProcessOptions,
    default: 'strict'
  }
});

// Some org fields are conditionally required
Org.pre('save', function(next) {
  if (this.budgeted && !typeof this.budget === 'number') {
    return next(new Error("Budgeted orgs must have a budget"));
  }
  if (this.terminal && this.children.length > 0) {
    return next(new Error("Terminal orgs cannot have children"));
  }
  next();
});

module.exports = mongoose.model("orgs", Org);