/**
 * Main Router
 **/

import express from 'express';
const router = express.Router();


const docs = require('../controllers/docs.controller');
router.get('/docs', docs.get);
