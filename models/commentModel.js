// models/commentModel.js
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Mixed = mongoose.Schema.Types.Mixed;
var constants = require('../utilities/constants');

var commentSchema = mongoose.Schema({
  posted: {
    type: Date,
    required: true,
    default: Date.now
  },
  user: {
    type: ObjectId,
    ref: 'users',
    required: true
  },
  text: {
    type: String,
    required: true,
  },
});

var Comment = mongoose.model("comments", commentSchema);

module.exports = {
  comment: Comment,
};