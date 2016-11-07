const express = require('express');
const Comment = require('../../../models/comment');

const router = express.Router();

//==============================================================================
// Routes
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

router.post('/', (req, res, next) => {
  let comment  = new Comment({
    body: req.query.body,
    author_id: req.query.author_id,
    asset_id: req.query.asset_id,
    parent_id: req.query.parent_id,
    status: req.query.status
  });
  comment.save().then(({id}) => {
    res.status(200).send(id);
  }).catch(error => {
    next(error);
  });
});

router.put('/:comment_id', (req, res, next) => {
  Comment.findById(req.params.comment_id).then((comment) => {
    comment.body = req.query.body;
    comment.author_id = req.query.author_id;
    comment.asset_id = req.query.asset_id;
    comment.parent_id = req.query.parent_id;
    comment.status = req.query.status;

    comment.save().then((comment) => {
      res.status(200).send(comment);
    });
  }).catch(error => {
    next(error);
  });
});

router.delete('/:comment_id', (req, res, next) => {
  Comment.findById(req.params.comment_id).then((comment) => {
    comment.remove().then(() => {
      res.status(201).send('OK. Deleted');
    });
  }).catch(error => {
    next(error);
  });
});

router.post('/:comment_id/status', (req, res, next) => {
  Comment.changeStatus(req.params.comment_id, req.query.status).then((comment) => {
    res.status(200).send(comment);
  }).catch(error => {
    next(error);
  });
});

router.post('/:comment_id/actions', (req, res) => {
  res.send('Add a comment action');
});

module.exports = router;
