import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'

const app = express();

//var apiRoutes = require("./api/routes");
//var commentRoutes = require('./comments/routes');

const mainRouter = require('./routers/main.router.js');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 1618);

app.use('/', mainRouter);

//app.use('/api/v1', apiRoutes);
//app.use('/api/v1/comments', commentRoutes);

app.listen(app.get('port'), () => {
	console.info(`Listening on port ${app.get('port')}!`);
});
