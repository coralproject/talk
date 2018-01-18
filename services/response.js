/**
 * escapeHTMLEntities will escape HTML entities with their unicode counterparts.
 *
 * @param {String} string the string containing potentially unsafe characters
 */
const escapeHTMLEntities = string =>
  string.replace(/[<>&]/g, function(c) {
    switch (c.charCodeAt(0)) {
      case 0x3c:
        return '\\u003c';
      case 0x3e:
        return '\\u003e';
      case 0x26:
        return '\\u0026';
      default:
        return c;
    }
  });

/**
 * encodeJSONForHTML will encode an object to be loaded on an HTML page.
 *
 * @param {Object} obj javascript object to encode
 */
const encodeJSONForHTML = obj => escapeHTMLEntities(JSON.stringify(obj));

module.exports = { escapeHTMLEntities, encodeJSONForHTML };
