const express = require('express');
const debug = require('debug')('talk:routes:plugins');
const plugins = require('../services/plugins');
const staticTemplate = require('../middleware/staticTemplate');
const nonce = require('../middleware/nonce');

const router = express.Router();

// TODO: re-add CSP once we've resolved issues with dynamic webpack loading.
router.use(staticTemplate, nonce);

// Inject server route plugins.
plugins.get('server', 'router').forEach(plugin => {
  debug(`added plugin '${plugin.plugin.name}'`);

  // Pass the root router to the plugin to mount it's routes.
  plugin.router(router);
});

module.exports = router;
