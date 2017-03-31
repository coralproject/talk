import {client as clientPlugins} from 'pluginsConfig';
import React from 'react';

function injectPlugins ({fill, ...props}) {
  let context,
    importedFiles;

  function buildContext() {

    /**
     *  buildContext creates the context for the plugins
     *  require.context(<path>, true, <regexp>
     *    path: The path where the importer builds the context. 'plugins' is allowed as path because it's an alias
     *    regxp: A Regular Expression to match the files that the importer needs. i.e (index.js, config.json)
     *  data such as path and regexp cannot be passed as arguments or variables
     */
    context = require.context('plugins', true, /\.\/(.*)\/client\/(index|config).(js|json)$/);
    return importedFiles = context
      .keys()
      .map(key => shapeData(key));
  }

  function getConfig (name) {

    /**
     *  getConfig finds a the config file for each plugin
     *  returns the config.json as an object to be passed as props to the plugin
     */
    return importedFiles
      .filter(key => key.format === 'json' && key.name === name)
      .reduce((acc, plugin) => {
        return context(plugin.key);
      }, {});
  }

  function addProps (plugin) {

    /**
     *  addProps add properties to the injected plugins
     */
    plugin.props = {
      ...getConfig(plugin.name),
      ...props
    };

    return plugin;
  }

  function filterBySlot (plugin) {

    /**
     *  filterBySlot
     */
    return plugin.props.slot === fill;
  }

  function init() {

    /**
     *  init will build the context and
     *  returns a map with each plugin and its instance
     */
    buildContext();

    return importedFiles
      .filter(filterByUserConfig)
      .filter(key => key.format === 'js')
      .map(addProps)
      .filter(filterBySlot)
      .reduce((entry, plugin, i) => {
        const component = context(plugin.key);
        const element = React.createElement(component, {
          key: i,
          ...plugin.props
        }, null);

        entry = [...entry, element];
        return entry;
      }, []);
  }

  return init();
}

function shapeData(test) {

  /**
   *  shapeData shapes each item in the plugins array with useful data
   *  returns an Object with the name of the plugin, the format, and it's key(filename)
   */
  const match = test.match(/\.\/(.*)\/client\/.*.(json|js)$/);
  return {
    name: match[1],
    format: match[2],
    key: match[0]
  };
}

function filterByUserConfig (plugin) {

  /**
   *  filterByUserConfig will filter the imported files and will only keep the allowed plugins
   */
  return clientPlugins.indexOf(plugin.name) > -1;
}

function importAll(context) {

  /**
   *  importAll builds the map to import
   */
  return context
    .keys()
    .map(key => shapeData(key))
    .filter(filterByUserConfig)
    .reduce((entry, actionsPlugin) => {
      const input = context(actionsPlugin.key);
      return {...entry, ...input};
    }, {});
}

function importAllAsArr(context) {

  /**
   *  importAllAsArr builds the array to import
   */
  return context
    .keys()
    .map(key => shapeData(key))
    .filter(filterByUserConfig)
    .reduce((entry, graphPlugin) => {
      const input = context(graphPlugin.key);
      const res = Object.keys(input)
        .map(key => input[key]);
      return [...entry, ...res];
    }, []);
}

function actionsImporter () {
  return importAll(require.context('plugins', true, /\.\/(.*)\/client\/actions.js$/));
}

function reducersImporter () {
  return importAll(require.context('plugins', true, /\.\/(.*)\/client\/reducer.js$/));
}

function graphImporter () {
  return importAllAsArr(require.context('plugins', true, /\.\/(.*)\/client\/(queries|mutations)\/index.js$/));
}

export default {
  injectPlugins,
  actionsImporter: actionsImporter(),
  reducersImporter: reducersImporter(),
  graphImporter: graphImporter()
};

