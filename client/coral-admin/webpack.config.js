const path = require('path')
const devConfig = require('./webpack.config.dev')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const Copy = require('copy-webpack-plugin')

module.exports = Object.assign({}, devConfig, {
  module: {
    context: __dirname,
    loaders: [
      { test: /.js$/, loader: 'babel', include: [path.join(__dirname, 'src'), path.join(__dirname, '../', 'coral-framework')], exclude: /node_modules/ },
      { test: /.json$/, loader: 'json', include: __dirname, exclude: /node_modules/ },
      { test: /.css$/, loaders: ['style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader'] }
    ]
  },
  plugins: [
    autoprefixer, precss
  ]
})
