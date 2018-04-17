const mongoose = require('../services/mongoose');
const { Setting } = require('./schema');

module.exports = mongoose.model('Setting', Setting);
