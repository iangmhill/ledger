// models/accountModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Account = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true,
    default: 0
  },
  virtualFunds: {
    type: [ObjectId],
    required: true,
    default: []
  }
});

module.exports = mongoose.model("accounts", Account);