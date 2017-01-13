const express = require('express');
const _ = require('lodash');
const scraper = require('../../../services/scraper');
const errors = require('../../../errors');
const url = require('url');

const Comment = require('../../../models/comment');
const User = require('../../../models/user');
const Action = require('../../../models/action');
const Asset = require('../../../models/asset');
const Setting = require('../../../models/setting');

const router = express.Router();

router.get('/', (req, res, next) => {

  let asset_url = decodeURIComponent(req.query.asset_url);

  // Verify that the asset_url is parsable.
  let parsed_asset_url = url.parse(asset_url);
  if (!parsed_asset_url.protocol) {
    return next(errors.ErrInvalidAssetURL);
  }

  // Get the asset_id for this url (or create it if it doesn't exist)
  Promise.all([

    // Find or create the asset by url.
    Asset.findOrCreateByUrl(asset_url)

      // Add the found asset to the scraper if it's not already scraped.
      .then((asset) => {
        if (!asset.scraped) {
          return scraper.create(asset).then(() => asset);
        }

        return asset;
      }),

    // Get the moderation setting from the settings.
    Setting.retrieve()
  ])
  .then(([asset, settings]) => {

    // Merge the asset specific settings with the returned settings object in
    // the event that the asset that was returned also had settings.
    if (asset && asset.settings) {
      settings.merge(asset.settings);
    }

    // Fetch the appropriate comments stream.
    let comments;

    if (settings.moderation === 'pre') {
      comments = Comment.findAcceptedByAssetId(asset.id);
    } else {
      comments = Comment.findAcceptedAndNewByAssetId(asset.id);
    }

    return Promise.all([

      // This is the promised component... Fetch the comments based on the
      // moderation settings.
      comments,

      // Send back the reference to the asset.
      asset,

      // Send back the settings to the stream.
      settings
    ]);
  })

  // Get all the users and actions for those comments.
  .then(([comments, asset, settings]) => {

    // Get the user id's from the author id's as a unique array that gets
    // sorted.
    let userIDs = _.uniq(comments.map((comment) => comment.author_id)).sort();

    // Fetch the users for which there is a comment available for them.
    let users = userIDs.length > 0 ? User.findByIdArray(userIDs) : [];

    // Fetch the actions for pretty much everything at this point.
    let actions = Action.getActionSummariesFromComments(asset.id, comments, req.user ? req.user.id : false);

    return Promise.all([

      // Pass back the asset that we loaded...
      asset,

      // It's comments...
      comments,

      // The users who wrote those comments
      users,

      // And all actions about the asset, comments, and users.
      actions,

      // Pass back the settings that we loaded.
      settings
    ]);
  })
  .then(([asset, comments, users, actions, settings]) => {

    // Send back the payload containing all this data.
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
