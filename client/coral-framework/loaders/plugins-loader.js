/**
 * Executes `source` to retrieve plugins configuration
 * and loads all modules of specified plugins.
 *
 * Outputs a module that looks like the following:
 *
 * module.exports.actions = [{plugin: string, module: callback}, ...]
 * module.exports.reducer = [{plugin: string, module: callback}, ...]
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
    list.push(`{module: () => require('plugins/${plugin}/client/${resource}'), plugin: '${plugin}'}`);
  }
}

module.exports = function(source) {
  this.cacheable();
  const plugins = this.exec(source, this.resourcePath).client;

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
