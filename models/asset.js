const mongoose = require('../services/mongoose');
const { Asset } = require('./schema');

module.exports = mongoose.model('Asset', Asset);
