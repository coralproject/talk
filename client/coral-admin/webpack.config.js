const path = require('path')
const fs = require('fs')
const devConfig = require('./webpack.config.dev')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const Copy = require('copy-webpack-plugin')
const config = require('./config.json')

// doing a string replace here because I spent a day trying to do it the "webpack" way
// ond nothing works. just trying to replace a string in an index.html file is
// apparently something no one has ever done in the js community.
let templateString = fs.readFileSync(path.join(__dirname, 'index.ejs')).toString()
templateString = templateString.replace('<%= basePath %>', config.basePath)
fs.writeFileSync(path.join(__dirname, 'public/index.html'), templateString)

module.exports = Object.assign({}, devConfig, {
  module: {
    context: __dirname,
    loaders: [
      { test: /.js$/, loader: 'babel', include: [path.join(__dirname, 'src'), path.join(__dirname, '../', 'coral-framework')], exclude: /node_modules/ },
      { test: /.json$/, loader: 'json', include: __dirname, exclude: /node_modules/ },
      { test: /.css$/, loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'] }
    ]
  },
  plugins: [
    new Copy([{
      from: path.join(__dirname, '..', 'coral-embed-stream', 'dist'),
      to: './embed/comment-stream'
    }]),
    autoprefixer, precss
  ]
})
