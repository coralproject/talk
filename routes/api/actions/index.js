const express = require('express');
const Action = require('../../../models/action');

const router = express.Router();

router.delete('/:action_id', (req, res, next) => {
  Action
    .findOneAndRemove({
      id: req.params.action_id
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
