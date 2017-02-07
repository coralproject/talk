const express = require('express');

const SetupService = require('../../../services/setup');

const router = express.Router();

router.get('/available', (req, res, next) => {
  SetupService
    .isAvailable()
    .then(() => {
      res.json({available: true});
    })
    .catch(() => {
      res.json({available: false});
    });
});

router.post('/', (req, res, next) => {

  SetupService
    .isAvailable()
    .then(() => {

      // Allow the request to keep going here.
      next();
    })
    .catch((err) => {
      next(err);
    });

}, (req, res, next) => {

  const {
    settings,
    user: {email, password, displayName}
  } = req.body;

  SetupService
    .setup({settings, user: {email, password, displayName}})
    .then(() => {

      // We're setup!
      res.status(204).end();
    })
    .catch((err) => {
      return next(err);
    });

});

module.exports = router;
