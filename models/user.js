const mongoose = require('../services/mongoose');
const { User } = require('./schema');

module.exports = mongoose.model('User', User);
