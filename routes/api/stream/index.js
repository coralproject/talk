const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('Stream endpoint has been hit with asset_id ', req.query.asset_id);
  res.json([
    {
      'id': 'abc',
      'type': 'comment',
      'body': 'Sample comment',
      'created_at': new Date().getTime(),
      'asset_id': 'assetTest'
    },
    {
      'id': 'xyz',
      'type': 'comment',
      'body': 'Sample reply',
      'created_at': new Date().getTime() - 600000,
      'parent_id': 'abc',
      'asset_id': 'assetTest'
    },
    {
      'id': 'def',
      'type': 'comment',
      'body': 'Another comment',
      'created_at': new Date().getTime() - 400000,
      'asset_id': 'assetTest'
    }
  ]).catch(next);
});

module.exports = router;
