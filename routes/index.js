const express = require('express');
const path = require('path');
const plugins = require('../services/plugins');
const debug = require('debug')('talk:routes');

const router = express.Router();

router.use('/api/v1', require('./api'));
router.use('/admin', require('./admin'));
router.use('/embed', require('./embed'));

/**
 * Serves a file based on a relative path.
 */
const serveFile = (filename) => (req, res) => res.sendFile(path.join(__dirname, filename));

/**
 * Serves the embed javascript files.
 */
router.get('/embed.js', serveFile('../dist/embed.js'));
router.get('/embed.js.gz', serveFile('../dist/embed.js.gz'));
router.get('/embed.js.map', serveFile('../dist/embed.js.map'));

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

// Inject server route plugins.
plugins.get('server', 'router').forEach((plugin) => {
  debug(`added plugin '${plugin.plugin.name}'`);

  // Pass the root router to the plugin to mount it's routes.
  plugin.router(router);
});

module.exports = router;
