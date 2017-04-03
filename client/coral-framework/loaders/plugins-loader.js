/**
 * Executes `source` to retrieve plugins configuration
 * and loads all modules of specified plugins.
 *
 * Outputs a module that looks like the following:
 *
 * module.exports.actions = [{plugin: string, getModule: callback}, ...]
 * module.exports.reducer = [{plugin: string, getModule: callback}, ...]
 * [...]
 *
 */
const {stripIndent} = require('common-tags');
const fs = require('fs');
const path = require('path');

function moduleExists(loc) {
  const fileExists = fs.existsSync(path.resolve(__dirname, loc));
  if (fileExists) {
    return true;
  }

  const hasExtension = /\.[^\/\\]*$/.test(loc);
  if (hasExtension) {
    return false;
  }

  // Find file with appended `.js` extension.
  return fs.existsSync(path.resolve(__dirname, `${loc}.js`));
}

function addIfExists(list, plugin, resource) {
  if (moduleExists(`../../../plugins/${plugin}/client/${resource}`)) {
    list.push(`{getModule: () => require('plugins/${plugin}/client/${resource}'), plugin: '${plugin}'}`);
  }
}

function getPluginList(config) {
  return config.client.map(x => typeof x === 'string' ? x : Object.keys(x)[0]);
}

module.exports = function(source) {
  this.cacheable();
  const config = this.exec(source, this.resourcePath);
  const plugins = getPluginList(config);

  const exports = {
    configs: [],
    actions: [],
    reducers: [],
    components: [],
    queries: [],
    mutators: [],
  };

  plugins.forEach(plugin => {
    addIfExists(exports.components, plugin, 'index.js');
    addIfExists(exports.configs, plugin, 'config.json');
    addIfExists(exports.actions, plugin, 'actions');
    addIfExists(exports.reducers, plugin, 'reducer');
    addIfExists(exports.mutators, plugin, 'mutations');
    addIfExists(exports.queries, plugin, 'queries');
  });

  let result = '';

  Object.keys(exports).forEach(key => {
    if (result) { result += '\n\n'; }
    result += stripIndent`
      module.exports.${key} = [
        ${exports[key].join(',')}
      ];
    `;
  });

  return result;
};
