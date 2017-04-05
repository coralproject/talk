const plugins = require('../services/plugins');
const _ = require('lodash');

// Core setup functions
let setupFunctions = {
  commentAdded: (options, args) => ({
    commentAdded: {
      filter: (comment) => comment.asset_id === args.asset_id
    },
  }),
};

/**
 * Plugin support requires that we merge in existing setupFunctions with our new
 * plugin based ones. This allows plugins to extend existing setupFunctions as well
 * as provide new ones.
 */
module.exports = plugins.get('server', 'setupFunctions').reduce((acc, {setupFunctions}) => {

  return _.merge(acc, setupFunctions);
}, setupFunctions);
