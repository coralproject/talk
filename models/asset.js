'use strict';

const mongoose = require('../mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema({
  title: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;
