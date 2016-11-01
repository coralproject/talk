'use strict';

const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const AssetSchema = new Schema({
  id: {
    type: String,
    default: uuid.v4,
    unique: true
  },
  title: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
},{
  _id: false
});

const Asset = mongoose.model('Asset', AssetSchema);

module.exports = Asset;
