const path = require('path')
const fs = require('fs')
const devConfig = require('./webpack.config.dev')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const Copy = require('copy-webpack-plugin')
const webpack = require('webpack')
const config = require('./config.json')

// doing a string replace here because I spent a day trying to do it the "webpack" way
// ond nothing works. just trying to replace a string in an index.html file is
// apparently something no one has ever done in the js community.
let templateString = fs.readFileSync(path.join(__dirname, 'index.ejs')).toString()
templateString = templateString.replace('<%= basePath %>', config.basePath)
fs.writeFileSync(path.join(__dirname, 'public/index.html'), templateString)

module.exports = Object.assign({}, devConfig, {
  module: {
    loader: [
      { test: /\.js$/, loaders: 'buble', include: [path.join(__dirname, 'src'), path.join(__dirname, '../', 'coral-framework')] },
      { test: /\.json$/, loaders: 'json', include: __dirname, exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader?modules&importLoaders=1!postcss-loader' }
    ]
  },
  plugins: [
    new Copy([{
      from: path.join(__dirname, '..', 'coral-embed-stream', 'dist'),
      to: './embed/comment-stream'
    }]),
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [autoprefixer, precss],
        minimize: true,
        debug: false
      }
    }),
    new webpack.optimize.UglifyJsPlugin()
  ]
})
