function dotizeRecurse(result, object, path = '') {
  for (const key in object) {
    const newPath = path ? `${path}.${key}` : key;
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      dotizeRecurse(result, object[key], newPath);
      continue;
    }
    result[newPath] = object[key];
  }
}

/**
 * Dotize turns a nested object into flattened object with
 * dotized key notation. Arrays do not become dotized.
 *
 * e.g. {a: {b: 'c'}} becomes {'a.b': 'c}
 *
 * @param {Object} object
 * @return {Object} dotized object
 */
function dotize(object) {
  const result = {};
  dotizeRecurse(result, object);
  return result;
}

module.exports = {
  dotize,
};
