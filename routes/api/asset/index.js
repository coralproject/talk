const express = require('express');
const router = express.Router();
const Asset = require('../../../models/asset');

// Get an asset by url
router.get('/url/:url', (req, res) => {

  Asset.findByUrl(req.params.url)
    .then((asset) => {
      res.json(asset);
    });

});

// Upsert an asset
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