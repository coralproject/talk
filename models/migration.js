const mongoose = require('../services/mongoose');
const { Migration } = require('./schema');

module.exports = mongoose.model('Migration', Migration);
