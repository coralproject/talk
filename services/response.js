const escapeHTMLEntities = require('escape-html');

/**
 * encodeJSONForHTML will encode an object to be loaded on an HTML page.
 *
 * @param {Object} obj javascript object to encode
 */
const encodeJSONForHTML = obj => escapeHTMLEntities(JSON.stringify(obj));

module.exports = { escapeHTMLEntities, encodeJSONForHTML };
