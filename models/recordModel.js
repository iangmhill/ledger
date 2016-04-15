// models/recordModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var Record = mongoose.Schema({
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: ObjectId,
    required: true
  },
  occurred: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['expense', 'transfer', 'revenue']
  },
  paymentMethod: {
    type: String,
    required: false
  },
  request: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  details: {
    type: String,
    required: true,
    default: "test"
  },
  org: {
    type: String,
    required: true
  },
  void: {
    type: Boolean,
    required: true,
    default: false
  },
  voider: {
    type: ObjectId,
    required: false
  }
});

// Some record fields are conditionally required
Record.pre('save', function(next) {
  if (this.void && !this.voider) {
    return next(new Error("Record cannot be voided without voider ID"));
  }
  if (this.type == 'expense' && !this.paymentMethod) {
    return next(new Error("Payment method must be recorded for all expenses"));
  }
  next();
});

module.exports = mongoose.model("records", Record);