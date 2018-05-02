const mongoose = require('../../services/mongoose');
const Schema = mongoose.Schema;

const Migration = new Schema({
  version: Number,
});

module.exports = Migration;
