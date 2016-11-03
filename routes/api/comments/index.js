const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Read all of the comments ever');
});

router.get('/:comment_id', (req, res) => {
  res.send('Read a comment');
});

router.post('/', (req, res) => {
  res.send('Write a comment');
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
