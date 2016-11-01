'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assetSchema = new Schema({
  title: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

var Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
