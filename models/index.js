const { reduce } = require('lodash');
const { CREATE_MONGO_INDEXES } = require('../config');

const Action = require('./action');
const Asset = require('./asset');
const Comment = require('./comment');
const Migration = require('./migration');
const Setting = require('./setting');
const User = require('./user');

const schema = { Action, Asset, Comment, Migration, Setting, User };

// Provide the schema to each of the plugins so that they can add in indexes if
// it is enabled.
if (CREATE_MONGO_INDEXES) {
  const plugins = require('../services/plugins');

  // Remap all of the models to their driver reference via the `collection`
  // field.
  const collections = reduce(
    schema,
    (collections, model, modelName) => {
      collections[modelName] = model.collection;
      return collections;
    },
    {}
  );

  // Defer the instantiation of the index caller functions when we're creating
  // indexes.
  plugins.defer('server', 'indexes', ({ indexes }) => {
    indexes(collections);
  });
}
