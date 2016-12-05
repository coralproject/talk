const express = require('express');
const Comment = require('../../../models/comment');
const Asset = require('../../../models/asset');
const wordlist = require('../../../services/wordlist');
const authorization = require('../../../middleware/authorization');

const router = express.Router();

router.get('/', authorization.needed('admin'), (req, res, next) => {

  const {
    status = null,
    action_type = null,
    asset_id = null
  } = req.query;

  /**
   * This adds the asset_id requirement to the query if the asset_id is defined.
   */
  const assetIDWrap = (query) => {
    if (asset_id) {
      query = query.where('asset_id', asset_id);
    }

    return query;
  };

  let query;

  if (status) {
    query = assetIDWrap(Comment.findByStatus(status === 'new' ? null : status));
  } else if (action_type) {
    query = Comment
      .findIdsByActionType(action_type)
      .then((ids) => assetIDWrap(Comment.find({
        id: {
          $in: ids
        },
      })));
  } else {
    query = assetIDWrap(Comment.all());
  }

  query
    .then(comments => {
      res.json(comments);
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/', wordlist.filter('body'), (req, res, next) => {

  const {
    body,
    asset_id,
    parent_id
  } = req.body;

  // Decide the status based on whether or not the current asset/settings
  // has pre-mod enabled or not. If the comment was rejected based on the
  // wordlist, then reject it, otherwise if the moderation setting is
  // premod, set it to `premod`.
  let status;

  if (req.wordlist.matched) {
    status = Promise.resolve('rejected');
  } else {
    status = Asset
      .rectifySettings(Asset.findById(asset_id))

      // Return `premod` if pre-moderation is enabled and an empty "new" status
      // in the event that it is not in pre-moderation mode.
      .then(({moderation}) => moderation === 'pre' ? 'premod' : '');
  }

  status.then((status) => Comment.publicCreate({
    body,
    asset_id,
    parent_id,
    status,
    author_id: req.user.id
  }))
  .then((comment) => {

    // The comment was created! Send back the created comment.
    res.status(201).send(comment);
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/:comment_id', authorization.needed('admin'), (req, res, next) => {
  Comment
    .findById(req.params.comment_id)
    .then(comment => {
      if (!comment) {
        res.status(404).end();
        return;
      }

      res.status(200).json(comment);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/:comment_id', authorization.needed('admin'), (req, res, next) => {
  Comment
    .removeById(req.params.comment_id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

router.put('/:comment_id/status', authorization.needed('admin'), (req, res, next) => {

  const {
    status
  } = req.body;

  Comment
    .changeStatus(req.params.comment_id, status)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    });
});

router.post('/:comment_id/actions', (req, res, next) => {

  const {
    action_type
  } = req.body;

  Comment
    .addAction(req.params.comment_id, req.user.id, action_type)
    .then((action) => {
      res.status(201).json(action);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
