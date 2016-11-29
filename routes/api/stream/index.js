const express = require('express');
const _ = require('lodash');
const scraper = require('../../../services/scraper');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Asset = require('../../../models/asset');
const Setting = require('../../../models/setting');

const router = express.Router();

router.get('/', (req, res, next) => {

  // Get the asset_id for this url (or create it if it doesn't exist)
  Promise.all([
    // Find or create the asset by url.
    Asset.findOrCreateByUrl(decodeURIComponent(req.query.asset_url))

      // Add the found asset to the scraper if it's not already scraped.
      .then((asset) => {
        if (!asset.scraped) {
          return scraper.create(asset).then(() => asset);
        }

        return asset;
      }),

    // Get the moderation setting from the settings.
    Setting.getModerationSetting()
  ])
  .then(([asset, settings]) => {
    // Get the sitewide moderation setting and return the appropriate comments
    let comments;
    if (settings.moderation === 'pre') {
      comments = Comment.findAcceptedByAssetId(asset.id);
    } else {
      comments = Comment.findAcceptedAndNewByAssetId(asset.id);
    }

    return Promise.all([comments, asset, settings]);
  })
  .then(([comments, asset, settings]) => {

    // Get the user id's from the author id's as a unique array that gets
    // sorted.
    let userIDs = _.uniq(comments.map((comment) => comment.author_id)).sort();

    // Fetch the users for which there is a comment available for them.
    let users = userIDs.length > 0 ? User.findByIdArray(userIDs) : [];

    // Fetch the actions for pretty much everything at this point.
    let actions = Action.getActionSummaries(_.uniq([

      // Actions can be on assets...
      asset.id,

      // Comments...
      ...comments.map((comment) => comment.id),

      // Or Authors...
      ...userIDs
    ]), req.user ? req.user.id : false);

    return Promise.all([

      // Pass back the asset that we loaded...
      asset,

      // It's comments...
      comments,

      // The users who wrote those comments
      users,

      // The actions on the above items
      actions,

      // And the relevant settings
      settings
    ]);
  })
  .then(([asset, comments, users, actions, settings]) => {
    res.json({
      assets: [asset],
      comments,
      users,
      actions,
      settings
    });
  })
  .catch(error => {
    next(error);
  });
});

module.exports = router;
