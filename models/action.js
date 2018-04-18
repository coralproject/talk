const mongoose = require('../services/mongoose');
const { Action } = require('./schema');

module.exports = mongoose.model('Action', Action);
