const mongoose = require('../services/mongoose');
const { Comment } = require('./schema');

module.exports = mongoose.model('Comment', Comment);
