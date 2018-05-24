const express = require('express');
const Joi = require('joi');
const { logger } = require('../../../services/logging');
const router = express.Router();

const schema = Joi.object().keys({
  'csp-report': Joi.object().keys({
    'document-uri': Joi.string(),
    referrer: Joi.string(),
    'blocked-uri': Joi.string(),
    'violated-directive': Joi.string(),
    'original-policy': Joi.string(),
  }),
});

const json = express.json({ type: 'application/csp-report' });

router.post('/', json, async (req, res, next) => {
  const { value, error: err } = Joi.validate(req.body, schema, {
    stripUnknown: true,
    presence: 'required',
  });
  if (err) {
    res.status(400).end();
    return;
  }

  logger.error({ report: value }, 'csp violation reported');

  res.status(202).end();
});

module.exports = router;
