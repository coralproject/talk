const express = require('express');
const Comment = require('../../../models/comment');
const Action = require('../../../models/action');

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

router.get('/action/:action_type', (req, res, next) => {
  Action.find({'action_type': req.params.action_type, 'item_type': 'comment'}).then((actions) => {
    // search all the comments that are in actions by id: item_id
    // populate user by user_id
    res.status(200).json(actions);
  }).catch(error => {
    next(error);
  });
});

router.get('/status/rejected', (req, res, next) => {
  Comment.find({'status': 'rejected'}).then((comments) => {
    res.status(200).json(comments);
  }).catch(error => {
    next(error);
  });
});

router.get('/status/pending', (req, res, next) => {
  Comment.find({'status': ''}).then((comments) => {
    res.status(200).json(comments);
  }).catch(error => {
    next(error);
  });
});

//==============================================================================
// Post Routes
//==============================================================================

router.post('/', (req, res, next) => {
  const {body, author_id, asset_id, parent_id, status} = req.body;
  let comment  = new Comment({body, author_id, asset_id, parent_id, status});
  comment.save().then(({id}) => {
    res.status(200).send({'id': id});
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
  Comment.changeStatus(req.params.comment_id, req.body.status).then((comment) => {
    res.status(200).send(comment);
  }).catch(error => {
    next(error);
  });
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
  Comment.remove(req.params.comment_id).then(() => {
    res.status(201).send('OK. Deleted');
  }).catch(error => {
    next(error);
  });
});

module.exports = router;
