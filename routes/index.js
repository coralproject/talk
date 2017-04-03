const express = require('express');
const path = require('path');

const router = express.Router();

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));
router.use('/embed', require('./embed'));
router.get('/embed.js', (req, res) => res.sendFile(path.join(__dirname, '../dist/embed.js')));
router.get('/embed.js.map', (req, res) => res.sendFile(path.join(__dirname, '../dist/embed.js.map')));

if (process.env.NODE_ENV !== 'production') {
  router.use('/assets', require('./assets'));

  router.get('/', (req, res) => {
    return res.render('article', {
      title: 'Coral Talk',
      asset_url: '',
      asset_id: '',
      body: '',
      basePath: '/client/embed/stream'
    });
  });
}

module.exports = router;
