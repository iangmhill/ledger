// models/recordModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
var constants = require('../utilities/constants');

var discriminator = {discriminatorKey: 'type'};

var itemSchema = mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: constants.itemCategories
  }
});

var recordSchema = mongoose.Schema({
  logged: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: ObjectId,
    ref: 'users',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  org: {
    type: ObjectId,
    ref: 'orgs',
    required: true
  },
  void: {
    type: Boolean,
    required: true,
    default: false
  },
  voider: {
    type: ObjectId,
    ref: 'users',
    required: false
  }
}, discriminator);

// Some record fields are conditionally required
recordSchema.pre('save', function(next) {
  if (this.void && !this.voider) {
    return next(new Error("Record cannot be voided without voider ID"));
  }
  next();
});

var Record = mongoose.model("records", recordSchema);

var Purchase = Record.discriminator('purchase', new mongoose.Schema({
  paymentMethod: {
    type: String,
    required: false,
    enum: ['pcard','reimbursement']
  },
  pcard: {
    type: Number,
    required: false
  },
  request: {
    type: ObjectId,
    ref: 'requests',
    required: true
  },
  items: {
    type: [itemSchema],
    required: false
  }
}, discriminator));

var Revenue = Record.discriminator('revenue', new mongoose.Schema({
}, discriminator));



module.exports = {
  record: Record,
  purchase: Purchase,
  revenue: Revenue
};