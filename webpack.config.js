const path = require('path');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const Copy = require('copy-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin');
const webpack = require('webpack');
// const plugins = require('./plugins.json');
// 'plugins': plugins.client.map(name => path.join(__dirname, `plugins/${name}/index`))
// Edit the build targets and embeds below.

const buildTargets = [
  'coral-admin',
  'coral-docs'
];

const buildEmbeds = [
  'stream'
];

module.exports = {
  devtool: '#cheap-module-source-map',
  entry: Object.assign({}, {
    'embed': [
      'babel-polyfill',
      path.join(__dirname, 'client/coral-embed/src/index')
    ]
  }, buildTargets.reduce((entry, target) => {

    // Add the entry for the bundle.
    entry[`${target}/bundle`] = [
      'babel-polyfill',
      path.join(__dirname, 'client/', target, '/src/index')
    ];

    return entry;
  }, {}), buildEmbeds.reduce((entry, embed) => {

    // Add the entry for the bundle.
    entry[`embed/${embed}/bundle`] = [
      'babel-polyfill',
      path.join(__dirname, 'client/', `coral-embed-${embed}`, '/src/index')
    ];

    return entry;
  }, {})),
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/client/',
    filename: '[name].js',

    // NOTE: this causes all exports to override the global.Coral, so no more
    // than one bundle.js can be included on a page.
    library: 'Coral'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js$/,
        query: {
          cacheDirectory: true,
          sourceMap: true
        }
      },
      {
        loader: 'json-loader',
        test: /\.json$/,
        exclude: /node_modules/
      },
      {
        loaders: [
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ],
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
        loader: 'url-loader?limit=100000',
        test: /\.woff$/
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader'
      }
    ]
  },
  plugins: [
    new LicenseWebpackPlugin({
      pattern: /^(MIT|ISC|BSD.*)$/,
      addUrl: true
    }),
    new Copy([
      ...buildEmbeds.map(embed => ({
        from: path.join(__dirname, 'client', `coral-embed-${embed}`, 'style'),
        to: path.join(__dirname, 'dist', 'embed', embed)
      })),
      {
        from: path.join(__dirname, 'client', 'lib'),
        to: path.join(__dirname, 'dist', 'embed', 'stream')
      }
    ]),
    autoprefixer,
    precss,
    new webpack.ProvidePlugin({
      'fetch': 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'VERSION': `"${require('./package.json').version}"`
      }
    })
  ],
  resolve: {
    alias: {
      plugins: path.resolve(__dirname, 'plugins/'),
    },
    modules: [
      path.resolve(__dirname, 'client'),
      path.resolve(__dirname, 'plugins'),
      ...buildTargets.map(target => path.join(__dirname, 'client', target, 'src')),
      ...buildEmbeds.map(embed => path.join(__dirname, 'client', `coral-embed-${embed}`, 'src')),
      'node_modules'
    ]
  }
};
