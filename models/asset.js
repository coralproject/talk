const mongoose = require('../mongoose');
const Schema = mongoose.Schema;

const Setting = require('./setting');

const uuid = require('uuid');

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
  scraped: {
    type: Date,
    default: null
  },
  settings: {
    type: Schema.Types.Mixed,
    default: null
  },
  closedAt: {
    type: Date,
    default: null
  },
  closedMessage: {
    type: String,
    default: null
  },
  title: String,
  description: String,
  image: String,
  section: String,
  subsection: String,
  author: String,
  publication_date: Date,
  modified_date: Date,
  status: {
    type: String,
    default: 'open'
  }
}, {
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

AssetSchema.index({
  title: 'text',
  url: 'text',
  description: 'text',
  section: 'text',
  subsection: 'text',
  author: 'text'
}, {
  background: true
});

/**
 * Returns true if the asset is closed, false else.
 */
AssetSchema.virtual('isClosed').get(function() {
  return this.closedAt && this.closedAt.getTime() <= new Date().getTime();
});

/**
 * Finds an asset by its id.
 * @param {String} id  identifier of the asset (uuid).
 */
AssetSchema.statics.findById = (id) => Asset.findOne({id});

/**
 * Finds a asset by its url.
 * @param {String} url  identifier of the asset (uuid).
 */
AssetSchema.statics.findByUrl = (url) => Asset.findOne({url});

/**
 * Retrieves the settings given an asset query and rectifies it against the
 * global settings.
 * @param  {Promise} assetQuery an asset query that returns a single asset.
 * @return {Promise}
 */
AssetSchema.statics.rectifySettings = (assetQuery) => Promise.all([
  Setting.retrieve(),
  assetQuery
]).then(([settings, asset]) => {

  // If the asset exists and has settings then return the merged object.
  if (asset && asset.settings) {
    return Object.assign({}, settings, asset.settings);
  }

  return settings;
});

/**
 * Finds a asset by its url.
 *
 * NOTE: This function has scalability concerns regarding mongoose's decision
 * always write {updated_at: new Date()} on every call to findOneAndUpdate
 * even though the update document exactly matches the query document... In
 * the future this function should never update, only findOneAndCreate but this
 * is not possible with the mongoose driver.
 *
 * @param {String} url  identifier of the asset (uuid).
 * @return {Promise}
 */
AssetSchema.statics.findOrCreateByUrl = (url) => Asset.findOneAndUpdate({url}, {url}, {

  // Ensure that if it's new, we return the new object created.
  new: true,

  // Perform an upsert in the event that this doesn't exist.
  upsert: true,

  // Set the default values if not provided based on the mongoose models.
  setDefaultsOnInsert: true
});

/**
 * Updates the settings for the asset.
 * @param  {[type]} id       [description]
 * @param  {[type]} settings [description]
 * @return {[type]}          [description]
 */
AssetSchema.statics.overrideSettings = (id, settings) => Asset.update({id}, {
  $set: {
    settings
  }
});

/**
 * Finds assets matching keywords on the model. If `value` is an empty string,
 * then it will not even perform a text search query.
 * @param  {String} value string to search by.
 * @return {Promise}
 */
AssetSchema.statics.search = (value) => value.length === 0 ? Asset.find({}) : Asset.find({
  $text: {
    $search: value
  }
});

const Asset = mongoose.model('Asset', AssetSchema);

module.exports = Asset;
