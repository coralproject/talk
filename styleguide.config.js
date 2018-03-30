module.exports = {
  // We use this pattern in order to exclude `index.js`.
  components: 'client/coral-ui-kit/components/**/[A-Z]*.js',
  // Our webpack config exports a array of configs, so we have
  // to select one.
  webpackConfig: require('./webpack.config.js')[1],
};
