const regExp = /[-\s]+(.)?/g;

/**
 * Convert dash separated strings to camel case.
 *
 * @param {String} str
 * @return {String}
 */

export default function camelize(str) {
  return str.replace(regExp, toUpper);
}

function toUpper(match, c) {
  return c ? c.toUpperCase() : '';
}
