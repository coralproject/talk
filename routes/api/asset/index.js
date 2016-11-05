const express = require('express');
const router = express.Router();
const Asset = require('../../../models/asset');

// Get many assets
router.get('/', (req, res) => {

  Asset.search(req.params.id)
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

// Get an asset by url
router.get('/url/:url', (req, res) => {

  Asset.findByUrl(req.params.url)
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
