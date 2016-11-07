const express = require('express');
const router = express.Router();
const Asset = require('../../../models/asset');

// Search assets.
router.get('/', (req, res, next) => {

  let query = {};

  if (typeof req.query.url !== 'undefined') {
    query.url = req.query.url;
  }

  Asset.search(query)
    .then((asset) => {
      res.json(asset);
    })
    .catch(next);

});

// Get an asset by id
router.get('/:id', (req, res, next) => {

  Asset.findById(req.params.id)
    .then((asset) => {
      res.json(asset);
    })
    .catch(next);

});

// Upsert an asset and return the affected document.
router.put('/', (req, res, next) => {

  Asset.upsert(req.body)
    .then((asset) => {
      res.json(asset);
    })
    .catch(next);

});


module.exports = router;
