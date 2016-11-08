
const path = require('path')
const fs = require('fs')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const config = require('./config.json')

// doing a string replace here because I spent a day trying to do it the "webpack" way
// ond nothing works. just trying to replace a string in an index.html file is
// apparently something no one has ever done in the js community.
let templateString = fs.readFileSync(path.join(__dirname, 'index.ejs')).toString()
templateString = templateString.replace('<%= basePath %>', config.basePath)
fs.writeFileSync(path.join(__dirname, 'public/index.html'), templateString)

module.exports = {
  entry: {
    'bundle': path.join(__dirname, 'src', 'index')
  },
  output: {
    path: path.join(__dirname, '..', '..', 'dist', 'coral-admin'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      { test: /.js$/, loader: 'babel', include: path.join(__dirname, 'src'), exclude: /node_modules/ },
      { test: /\.json$/, loaders: 'json', include: __dirname, exclude: /node_modules/ },
      { test: /.css$/, loaders: ['style-loader', 'css-loader?importLoaders=1', 'postcss-loader'] }
    ]
  },
  plugins: [ autoprefixer, precss ],
  resolve: {
    root: [
      path.resolve('./src'),
      path.resolve('../')
    ]
  },
  devServer: {
    historyApiFallback: {
      index: '/'
    }
  }
}
