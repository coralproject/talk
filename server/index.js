/* This is the entrypoint for the Talk Platform server. */

// Initialize application framework.
var express = require('express');
var app = express();

// Load routes.
var apiRoutes = require("./api/routes");
var commentRoutes = require('./comments/routes');

// Initialize mongoose.
var mongoose = require("mongoose");

// Connect to the database
mongoose.connect('mongodb://localhost/talk');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	ready();
});

// Initialize Static Endpoints.
var initializeStatic = function() {
	// TODO
}

// Initialize API endpoints.
var initializeAPI = function () {
	app.use('/api/v1', apiRoutes);
	app.use('/api/v1/comments', commentRoutes);
}

// Initialize server when ready.
var ready = function () {

	var port = 1618;

	initializeStaticEndpoints();
	initializeAPI();

	// Listen for incoming requests.
	app.listen(port, function () {
		console.log('Listening on port ' + port + '!');
	});

}