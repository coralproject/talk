const express = require('express');
const router = express.Router();

const Assets = require('../../services/assets');

const body = 'Lorem ipsum dolor sponge amet, consectetur adipiscing clam. Ut lobortis sollicitudin pillar a ornare. Curabitur dignissim vestibulum cay non rhoncus. Cras laoreet ante vel nunc hendrerit, shelf imperdiet neque egestas. Suspendisse aliquet iaculis fermentum. Talk volutpat, tellus posuere laoreet consequat, mi lacus laoreet massa, sed vehicula mauris velit non lectus. Integer non trust nec neque congue faucibus porttitor sit amet elkhorn.';

router.get('/id/:asset_id', (req, res, next) => {

  return Assets.findById(req.params.asset_id)
    .then((asset) => {
      if (asset === null) {
        return res.json({'message': 'Asset not found'});
      }
      res.render('article', {
        title: asset.title,
        asset_id: asset.id,
        asset_url: asset.url,
        body: '',
        basePath: '/client/embed/stream'
      });
    })
    .catch((err) => next(err));
});

router.get('/title/:asset_title', (req, res) => {
  return res.render('article', {
    title: req.params.asset_title.split('-').join(' '),
    asset_url: '',
    asset_id: null,
    body: body,
    basePath: '/client/embed/stream'
  });
});

router.get('/', (req, res, next) => {
  let skip = req.query.skip ? parseInt(req.query.skip) : 0;
  let limit = req.query.limit ? parseInt(req.query.limit) : 25;

  return Assets.all(skip, limit)
    .then((assets) => {
      res.render('articles', {
        assets: assets
      });
    })
    .catch((err) => next(err));
});

module.exports = router;
