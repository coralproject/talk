const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const Copy = require('copy-webpack-plugin');
const webpack = require('webpack');

// Edit the build targets and embeds below.

const buildTargets = [
  'coral-admin'
];

const buildEmbeds = [
  'stream'
];

module.exports = {
  devtool: 'inline-source-map',
  entry: buildTargets.reduce((entry, target) => {

    // Add the entry for the bundle.
    entry[`${target}/bundle`] = [
      'babel-polyfill',
      path.join(__dirname, 'client/', target, '/src/index')
    ];

    return entry;
  }, buildEmbeds.reduce((entry, embed) => {

    // Add the entry for the bundle.
    entry[`embed/${embed}/bundle`] = [
      'babel-polyfill',
      path.join(__dirname, 'client/', `coral-embed-${embed}`, '/src/index')
    ];

    return entry;
  }, {})),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/,
        test: /\.js$/
      },
      {
        loader: 'json',
        test: /\.json$/,
        exclude: /node_modules/
      },
      {
        loaders: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader'],
        test: /.css$/,
      },
      {
        loader: 'url-loader?limit=100000',
        test: /\.png$/
      },
      {
        loader: 'file-loader',
        test: /\.(jpg|png|gif|svg)$/
      },
      {
        loader: 'url?limit=100000',
        test: /\.woff$/
      }
    ]
  },
  plugins: [
    new Copy(buildEmbeds.map(embed => ({
      from: path.join(__dirname, 'client', `coral-embed-${embed}`, 'style'),
      to: path.join(__dirname, 'dist', 'embed', embed)
    }))),
    autoprefixer,
    precss,
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ],
  resolve: {
    root: [
      path.join(__dirname, 'client'),
      ...buildTargets.map(target => path.join(__dirname, 'client', target, 'src')),
      ...buildEmbeds.map(embed => path.join(__dirname, 'client', `coral-embed-${embed}`, 'src'))
    ]
  }
};
