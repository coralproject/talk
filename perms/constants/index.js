const merge = require('lodash/merge');

const mutation = require('./mutation');
const query = require('./query');
const subscription = require('./subscription');

module.exports = merge(...[mutation, query, subscription]);
