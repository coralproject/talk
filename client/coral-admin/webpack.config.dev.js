
const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const precss = require('precss')
const config = require('./config.json')

// doing a string replace here because I spent a day trying to do it the "webpack" way
// ond nothing works. just trying to replace a string in an index.html file is
// apparently something no one has ever done in the js community.
let templateString = fs.readFileSync('./index.ejs').toString()
templateString = templateString.replace('<%= basePath %>', config.basePath)
fs.writeFileSync('./public/index.html', templateString)

console.log(templateString)

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
      { test: /.js$/, loaders: 'buble', include: path.join(__dirname, 'src') },
      { test: /.json$/, loaders: 'json', include: __dirname, exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader?modules&importLoaders=1!postcss-loader' }
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        context: __dirname,
        postcss: [autoprefixer, precss]
      }
    })
  ],
  resolve: {
    modules: [
      path.resolve('./src'),
      path.resolve('../'),
      'node_modules'
    ]
  },
  devServer: {
    historyApiFallback: {
      index: '/'
    }
  }
}
