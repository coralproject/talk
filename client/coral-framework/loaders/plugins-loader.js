/**
 * Executes `source` to retrieve plugins configuration
 * and loads the `index.js` of specified plugins.
 *
 * Outputs a module that looks like the following:
 *
 * module.exports = [{plugin: string, module: object}, ...]
 *
 */
const { stripIndent } = require('common-tags');

function getPluginList(config) {
  if (config && config.client) {
    return config.client.map(
      x => (typeof x === 'string' ? x : Object.keys(x)[0])
    );
  }

  return [];
}

module.exports = function(source) {
  this.cacheable();
  const config = this.exec(source, this.resourcePath);
  const plugins = getPluginList(config).map(
    plugin => `{
    module: require('${plugin}/client').default,
    name: '${plugin}'
  }`
  );

  return stripIndent`
    module.exports = [
      ${plugins.join(',')}
    ];
  `;
};
