const express = require('express');
const debug = require('debug')('talk:routes:plugins');
const plugins = require('../services/plugins');
const staticTemplate = require('../middleware/staticTemplate');

const router = express.Router();

// Routes mounted from plugins won't have access to our internal partials
// directory, so we should make that available.
router.use(staticTemplate, (req, res, next) => {
  res.locals.root = res.app.get('views');
  next();
});

// Inject server route plugins.
plugins.get('server', 'router').forEach(plugin => {
  debug(`added plugin '${plugin.plugin.name}'`);

  // Pass the root router to the plugin to mount it's routes.
  plugin.router(router);
});

module.exports = router;
