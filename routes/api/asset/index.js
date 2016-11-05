const express = require('express');
const router = express.Router();
const Asset = require('../../../models/asset');

// Search assets.
router.get('/', (req, res) => {

  let query = {};

  if (typeof req.query.url !== 'undefined') {
    query.url = req.query.url;
  }

  Asset.search(query)
    .then((asset) => {
      res.json(asset);
    });

});

// Get an asset by id
router.get('/:id', (req, res) => {

  Asset.findById(req.params.id)
    .then((asset) => {
      res.json(asset);
    });

});

// Upsert an asset and return the affected document.
router.put('/', (req, res) => {

  Asset.upsert(req.body)
    .then((asset) => {

      res.json(asset);

    })
    .catch((err) => {
      console.error(err);
      res.json(err);
    });

});


module.exports = router;
