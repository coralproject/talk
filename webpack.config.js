const webpack = require('webpack');
const devConfig = require('./webpack.config.dev');

// Disable source maps.
devConfig.devtool = null;

devConfig.plugins = devConfig.plugins.concat([
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.DedupePlugin()
]);

module.exports = devConfig;
