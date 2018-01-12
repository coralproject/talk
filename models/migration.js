const mongoose = require('../services/mongoose');
const Schema = mongoose.Schema;

const MigrationSchema = new Schema({
  version: Number,
});

const Migration = mongoose.model('Migration', MigrationSchema);

module.exports = Migration;
