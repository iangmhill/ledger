// models/orgModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Org = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  classification: {
    type: String,
    required: true,
    enum: ['club', 'organization']
  },
  virtualFund: {
    type: ObjectId,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  allocations: {
    type: [ObjectId],
    required: true,
    default: []
  }
});

module.exports = mongoose.model("orgs", Org);