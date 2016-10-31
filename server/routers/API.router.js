import express from 'express';
const router =  express.Router();

const comment = require('../controllers/comment.controller');

router.route('/comments').get(comment.list);
router.route('/comments/:commentId').get(comment.get);
router.route('/comments').post(comment.add);
router.route('/comments/:commentId').post(comment.edit);
router.route('/comments/:commentId').post(comment.del);
