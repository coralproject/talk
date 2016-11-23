const express = require('express');
const Comment = require('../../../models/comment');
const Setting = require('../../../models/setting');
const authorization = require('../../../middleware/authorization');

const router = express.Router();

//==============================================================================
// Get Routes
//==============================================================================

// Returns back all the comments that are in the moderation queue. The moderation queue is pre or post moderated,
// depending on the settings. The :moderation overwrites this settings.
// Pre-moderation:  New comments are shown in the moderator queues immediately.
// Post-moderation: New comments do not appear in moderation queues unless they are flagged by other users.
router.get('/comments/pending', authorization.needed('admin'), (req, res, next) => {
  Setting.getModerationSetting().then(function({moderation}){
    Comment.moderationQueue(moderation).then((comments) => {
      res.status(200).json(comments);
    });
  })
  .catch(error => {
    next(error);
  });
});

module.exports = router;
