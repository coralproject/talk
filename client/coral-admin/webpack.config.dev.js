const path = require('path')
const autoprefixer = require('autoprefixer')
const precss = require('precss')

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
      { test: /.css$/, loaders: ['style-loader', 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]', 'postcss-loader'] }
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
