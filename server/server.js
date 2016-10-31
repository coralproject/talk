/* This is the entrypoint for the Talk Platform server. */

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'

const app = express();

// Load routes.
var apiRoutes = require("./api/routes");
var commentRoutes = require('./comments/routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 1618);

// Initialize Static Endpoints.
const initializeStatic = function() {
	// TODO
}

// Initialize API endpoints.
const initializeAPI = function () {
	app.use('/api/v1', apiRoutes);
	app.use('/api/v1/comments', commentRoutes);
}

// Initialize server when ready.
const ready = () => {
	initializeStaticEndpoints();
	initializeAPI();

	// Listen for incoming requests.
	app.listen(app.get('port'), () => {
		console.info(`Listening on port ${app.get('port')}!`);
	})
}
