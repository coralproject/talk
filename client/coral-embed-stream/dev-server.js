var path = require('path')
var express = require('express')
var http = require('http')
var webpack = require('webpack')
var config = require('./webpack.config.dev')
var Dashboard = require('webpack-dashboard')
var DashboardPlugin = require('webpack-dashboard/plugin')

var app = express()
var server = http.Server(app)

var compiler = webpack(config)
var dashboard = new Dashboard()
compiler.apply(new DashboardPlugin(dashboard.setData))

app.use(express.static('public'))

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  quiet: true,
  publicPath: config.output.publicPath
}))

app.use(require('webpack-hot-middleware')(compiler, {log: () => {}}))

app.get('/default.css', function (req, res) {
  res.sendFile(path.join(__dirname, '/style/default.css'))
})

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

server.listen(6182, 'localhost', function (err) {
  if (err) {
    console.log(err)
    return
  }

  console.log('Listening at http://localhost:6182')
})
