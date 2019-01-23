const express = require('express');
const router = express.Router();
const casual = require('casual');
const { ErrHTTPNotFound } = require('../../errors');
const Asset = require('../../models/asset');

router.get('/id/:asset_id', async (req, res, next) => {
  try {
    const asset = await Asset.findOne({ id: req.params.asset_id });
    if (asset === null) {
      throw new ErrHTTPNotFound();
    }

    res.render('dev/article.njk', {
      title: asset.title,
      asset_id: asset.id,
      asset_url: asset.url,
    });
  } catch (err) {
    return next(err);
  }
});

router.get('/random', (req, res) => {
  const title = casual.title;

  res.redirect(`./title/${title.replace(/ /g, '-')}`);
});

router.get('/title/:asset_title', (req, res) => {
  res.render('dev/article.njk', {
    title: req.params.asset_title.split('-').join(' '),
    asset_url: '',
    asset_id: null,
  });
});

router.get('/', async (req, res, next) => {
  try {
    const skip = req.query.skip ? parseInt(req.query.skip) : 0;
    const limit = req.query.limit ? parseInt(req.query.limit) : 6;

    const [assets, count] = await Promise.all([
      Asset.find({})
        .sort({ created_at: 1 })
        .limit(limit)
        .skip(skip),
      Asset.count(),
    ]);

    res.render('dev/articles.njk', {
      skip,
      limit,
      count,
      assets,
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
