var webpack = require('webpack');
var path = require('path');
var ExternalsPlugin = require('webpack-externals-plugin');

module.exports = {
	entry: [
		path.resolve(__dirname, 'index.js')
	],
	output: {
		path: __dirname + '/build',
		filename: 'server.js'
	},
	target: 'node',
	node: {
		__filename: true,
		__dirname: true
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.json'],
		modules: [
			'node_modules'
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: [
						'react',
						'es2015',
						'stage-0',
					],
					plugins: []
				},
			}, {
				test: /\.json$/,
				loader: 'json-loader',
			},
		],
	},
	plugins: [
		new ExternalsPlugin({
			type: 'commonjs',
			include: path.join(__dirname, './node_modules/'),
		})
	]
};
