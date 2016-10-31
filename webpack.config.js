var webpack = require('webpack');

module.exports = {
	entry: path.resolve(__dirname, 'server/index.js'),
	output: {
		path: __dirname + '/dist',
		filename: 'server.js'
	},
	target: 'node',
	node: {
		__filename: true,
		__dirname: true
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
		modules: [
			'server',
			'node_modules'
		]
	},
	module: {
		loaders: [{
		test: /\.js$/,
		exclude: /node_modules/,
		loader: 'babel-loader',
		query: {
		presets: [
			'react',
			'es2015',
			'stage-0'
		],
		plugins: []
	}
};
