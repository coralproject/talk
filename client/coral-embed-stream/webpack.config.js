const path = require('path')
const webpack = require('webpack')
const Copy = require('copy-webpack-plugin')

//Keeping this file for reference, it should move to a global webpack.

module.exports = {
  devtool: 'source-map',
  entry: [
    'babel-polyfill',
    './src/app'
  ],
  output: {
    path: path.join(__dirname, '..', '..','dist', 'coral-embed-stream'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'src')
    ],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new Copy([{
      from: './index.html'
    },
    {
      from: './style/default.css'
    },
    {
      from: './public/',
      to: './'
    },
    {
      from: path.resolve(__dirname, '..', 'coral-framework', 'i18n', 'translations'),
      to: './translations'
    }]),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.ExtendedAPIPlugin()
  ],
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loaders: ['babel'],
      exclude: /node_modules/,
      include: path.join(__dirname, '../')
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.png$/,
      loader: 'url-loader?limit=100000'
    }, {
      test: /\.jpg$/,
      loader: 'file-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.woff$/,
      loader: 'url?limit=100000'
    }]
  }
}
