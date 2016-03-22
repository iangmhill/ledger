// models/virtualFundModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var VirtualFund = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
  account: {
    type: ObjectId,
    required: true
  },
  orgs: {
    type: [ObjectId],
    required: true,
    default: []
  }
});

module.exports = mongoose.model("virtualFunds", VirtualFund);