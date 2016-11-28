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
  .then(([asset, {moderation}]) => {
    let comments;

    if (moderation === 'post') {
      comments = Comment.findAcceptedByAssetId(asset.id);
    } else {

      // Defaults to 'pre' moderation.
      comments = Comment.findAcceptedAndNewByAssetId(asset.id);
    }

    return Promise.all([

      // This is the promised component... Fetch the comments based on the
      // moderation settings.
      comments,

      // Send back the reference to the asset.
      asset
    ]);
  })
  // Get all the users and actions for those comments.
  .then(([comments, asset]) => {

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

      // All the users/authors of those comments...
      users,

      // And all actions about the asset, comments, and users.
      actions
    ]);
  })
  .then(([asset, comments, users, actions]) => {

    // Send back the payload containing all this data.
    res.json({
      assets: [asset],
      comments,
      users,
      actions
    });
  })
  .catch(error => {
    next(error);
  });
});

module.exports = router;
