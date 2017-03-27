function importer () {
  const context = require.context("../../../plugins", true, /\.\/(.*)\/client\/index.js$/);
  let res = {};

  context.keys().forEach(function (key) {
    res[key] = context(key)
  });

  return res;
}

export default importer();