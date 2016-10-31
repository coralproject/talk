/**
 * Main Router
 **/

import express from 'express';
const router = express.Router();
const docs = require('../controllers/docs.controller');

router.get('/', (req, res) => {
	res.send('Talk API!')
});

router.get('/docs', docs.get);

module.exports = router;
