const express = require('express');

const router = express.Router();

const defaultComment = {
  body: 'This is a comment!',
  name: 'John Doe',
  createdAt: Date.now()
};

router.get('/', (req, res) => {
  const status = req.query.type || 'pending';
  res.json([Object.assign({}, defaultComment, {status})]);
});

module.exports = router;
