const express = require('express');
const ActionsService = require('../../../services/actions');

const router = express.Router();

router.delete('/:action_id', (req, res, next) => {
  ActionsService
    .findOneAndRemove({
      id: req.params.action_id,
      user_id: req.user.id
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(error => {
      next(error);
    });
});

module.exports = router;
