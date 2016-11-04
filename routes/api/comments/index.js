const express = require('express');
const Comment = require('../../../models/comment');

const router = express.Router();

//==============================================================================
// Validations on parameters
//==============================================================================

router.param('comment_id', function(res, req, next, comment_id) {
  req.comment_id = comment_id;
  next();
});

//==============================================================================
// Routes
//==============================================================================


router.get('/', (req, res) => {
  res.send('Read all of the comments ever');
});

router.get('/:comment_id', (req, res, next) => {
  Comment.findById(req.params.comment_id, function(err, comment) {
    if(err) {
      res.status(500);
      return next(err);
    }
    res.status(200);
    res.send(comment);
    next();
  });
});

router.post('/', (req, res, next) => {
  let comment  = new Comment({
    body: req.query.comment,
    author_id: req.query.author_id,
    asset_id: req.query.asset_id,
    parent_id: req.query.parent_id,
    status: req.query.status
  });
  comment.save(function(err, comment) {
    if(err) {
      res.status(500);
      return next(err);
    }
    res.status(201);
    res.send(comment.id);
    next();
  });
});

router.put('/:comment_id', (req, res) => {
  res.send('Update a comment');
});

router.delete('/:comment_id', (req, res) => {
  res.send('Delete a comment');
});

router.post('/:comment_id/status', (req, res) => {
  res.send('Update a comment status');
});

router.post('/:comment_id/actions', (req, res) => {
  res.send('Add a comment action');
});

module.exports = router;
