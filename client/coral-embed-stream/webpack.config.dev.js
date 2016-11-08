var path = require('path')
var webpack = require('webpack')
const Copy = require('copy-webpack-plugin')

module.exports = {
  devtool: 'eval',
  entry: [
    'babel-polyfill',
    'webpack-hot-middleware/client',
    path.join(__dirname, 'src', 'app')
  ],
  output: {
    path: path.join(__dirname, '..', '..','dist', 'coral-embed-stream'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    root: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, '..')
    ],
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new Copy([{
      from: path.join(__dirname, 'index.html')
    },
    {
      from: path.join(__dirname, 'style', 'default.css')
    },
    {
      from: path.join(__dirname, 'public'),
      to: './'
    }]),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    }),
    new webpack.NoErrorsPlugin()
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
      test: /\.(jpg|png|gif|svg)$/,
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
