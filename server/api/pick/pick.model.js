'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PickSchema = new Schema({
  yelpId: String,
  userIds: Array,
  pickCount: Number
});

module.exports = mongoose.model('Pick', PickSchema);