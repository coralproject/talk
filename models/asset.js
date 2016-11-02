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

/**
 * Finds an asset by the id.
 * @param {String} id  identifier of the asset (uuid)
*/
AssetSchema.methods.findById = function(id, done) {
  Asset.findOne({
    id : id
  }, (err, asset) => {
    if (err) {
      return done(err);
    }

    if (!asset) {
      return done(null, false);
    }
    return done(null, asset);
  });
};

const Asset = mongoose.model('Asset', AssetSchema);

module.exports = Asset;
