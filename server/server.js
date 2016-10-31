import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'

const mainRouter = require('./routers/main.router.js');
const APIRouter = require('./routers/API.router.js');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('port', process.env.PORT || 1618);

app.use('/', mainRouter);
app.use('/api/v1', APIRouter);

app.listen(app.get('port'), () => {
	console.info('==> TALK API is listening in ' + process.env.NODE_ENV + ' mode');
	console.info(`Listening on port ${app.get('port')}!`);
});
