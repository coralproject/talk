const express = require('express');
const path = require('path');
const plugins = require('../services/plugins');
const debug = require('debug')('talk:routes');

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
      body: '',
      basePath: '/client/embed/stream'
    });
  });
}

// Inject server route plugins.
plugins.get('server', 'routes').forEach(({plugin, routes}) => {
  debug(`added plugin '${plugin.name}'`);

  // Pass the root router to the plugin to mount it's routes.
  routes(router);
});

module.exports = router;
