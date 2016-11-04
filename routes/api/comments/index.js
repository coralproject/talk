const express = require('express');
const Comment = require('../../../models/comment');

const router = express.Router();

//==============================================================================
// Routes
//==============================================================================


router.get('/', (req, res) => {
  res.send('Read all of the comments ever');
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
    res.status(201).send(id);
  }).catch(error => {
    console.log(error);
    next(error);
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
