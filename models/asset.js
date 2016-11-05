const mongoose = require('../mongoose');
const uuid = require('uuid');
const Schema = mongoose.Schema;

const AssetSchema = new Schema({

  id: {
    type: String,
    default: uuid.v4,
    unique: true,
    index: true
  },
  url: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String,
    default: 'article'
  },
  headline: String,
  summary: String,
  section: String,
  subsection: String,
  authors: [String],
  publication_date: Date
},{
  _id: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});


/**
 * Finds an asset by its id.
 * @param {String} id  identifier of the asset (uuid)
*/
AssetSchema.statics.findById = function(id) {

  return Asset.findOne({id});

};

/**
 * Finds a asset by its url.
 * @param {String} url  identifier of the asset (uuid)
*/
AssetSchema.statics.findByUrl = function(url) {
 
  return Asset.findOne({url: url});

};


/**
 * Upserts an asset.
*/
AssetSchema.statics.upsert = function(data) {

  // If an id is not sent, create one.
  if (typeof data.id === 'undefined') {
    data.id = uuid.v4();
  }

  return Asset.update({id: data.id}, data, {upsert: true});
  
};

const Asset = mongoose.model('Asset', AssetSchema);

module.exports = Asset;
