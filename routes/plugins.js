const express = require('express');
const debug = require('debug')('talk:routes:plugins');
const plugins = require('../services/plugins');

const router = express.Router();

// Inject server route plugins.
plugins.get('server', 'router').forEach(plugin => {
  debug(`added plugin '${plugin.plugin.name}'`);

  // Pass the root router to the plugin to mount it's routes.
  plugin.router(router);
});

module.exports = router;
