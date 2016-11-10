const express = require('express');
const Comment = require('../../../models/comment');

const Setting = require('../../../models/setting');

const router = express.Router();

//==============================================================================
// Get Routes
//==============================================================================

router.get('/', (req, res, next) => {
  Comment.find({}).then((comments) => {
    res.status(200).json(comments);
  }).catch(error => {
    next(error);
  });
});

router.get('/:comment_id', (req, res, next) => {
  Comment.findById(req.params.comment_id).then((comment) => {
    res.status(200).json(comment);
  }).catch(error => {
    next(error);
  });
});

//==============================================================================
// Moderation Queues Routes
//==============================================================================

// Get all the comments that have that action_type over them.
router.get('/action/:action_type', (req, res, next) => {
  Comment.findByActionType(req.params.action_type).then((comments) => {
    res.status(200).json(comments);
  }).catch(error => {
    next(error);
  });
});

// Get all the comments that were rejected.
router.get('/status/rejected', (req, res, next) => {
  Comment.findByStatus('rejected').then((comments) => {
    res.status(200).json(comments);
  }).catch(error => {
    next(error);
  });
});

// Returns back all the comments that are in the moderation queue. The moderation queue is pre or post moderated,
// depending on the settings. The :moderation overwrites this settings.
// Pre-moderation:  New comments are shown in the moderator queues immediately.
// Post-moderation: New comments do not appear in moderation queues unless they are flagged by other users.
router.get('/status/pending', (req, res, next) => {
  Setting.getModerationSetting().then(function({moderation}){
    let moderationValue = req.query.moderation;
    if (typeof moderationValue === 'undefined' || moderationValue === undefined) {
      moderationValue = moderation;
    }
    Comment.moderationQueue(moderationValue).then((comments) => {
      res.status(200).json(comments);
    });
  }).catch(error => {
    next(error);
  });
});

//==============================================================================
// Post Routes
//==============================================================================

router.post('/', (req, res, next) => {
  const {body, author_id, asset_id, parent_id, status, username} = req.body;
  Comment.new(body, author_id, asset_id, parent_id, status, username).then((comment) => {
    res.status(200).send({'id': comment.id});
  }).catch(error => {
    next(error);
  });
});

router.post('/:comment_id', (req, res, next) => {
  Comment.findById(req.params.comment_id).then((comment) => {
    comment.body = req.body.body;
    comment.author_id = req.body.author_id;
    comment.asset_id = req.body.asset_id;
    comment.parent_id = req.body.parent_id;
    comment.status = req.body.status;
    return comment.save();
  }).then((comment) => {
    res.status(200).send(comment);
  }).catch(error => {
    next(error);
  });
});

router.post('/:comment_id/status', (req, res, next) => {
  
  Comment
    .changeStatus(req.params.comment_id, req.body.status)
    .then(comment => res.status(200).send(comment))
    .catch(error => next(error));

});

router.post('/:comment_id/actions', (req, res, next) => {
  Comment.addAction(req.params.comment_id, req.body.user_id, req.body.action_type).then((action) => {
    res.status(200).send(action);
  }).catch(error => {
    next(error);
  });
});

//==============================================================================
// Delete Routes
//==============================================================================

router.delete('/:comment_id', (req, res, next) => {
  Comment.removeById(req.params.comment_id).then(() => {
    res.status(201).send('OK. Removed');
  }).catch(error => {
    next(error);
  });
});

module.exports = router;
