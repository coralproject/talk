import {client as clientPlugins} from 'pluginsConfig';
import React from 'react';
import mapValues from 'lodash/mapValues';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import merge from 'lodash/merge';

// Gather require context information of different parts of the plugins.
const contextMap = {
  actions: require.context('plugins', true, /\.\/(.*)\/client\/actions.js$/),
  reducers: require.context('plugins', true, /\.\/(.*)\/client\/reducer.js$/),
  graph: require.context('plugins', true, /\.\/(.*)\/client\/(mutations|queries)\/index.js$/),
  configs: require.context('plugins', true, /\.\/(.*)\/client\/config.json$/),
  components: require.context('plugins', true, /\.\/(.*)\/client\/index.js$/),
};

const getPluginName = (key) => key.match(/\.\/(.*)\/client\/.*$/)[1];
const isActivePlugin = (plugin) => clientPlugins.indexOf(plugin) > -1;

/**
 * Returns a callback that loads enabled modules of the context and
 * returns an Array with {plugin, module} entries. Consecutive calls
 * will return a memoized result.
 */
function createLoader(context) {
  let loaded = null;
  return () => {
    if (!loaded) {
      loaded = context
        .keys()
        .map(key => ({key, plugin: getPluginName(key)}))
        .filter(info => isActivePlugin(info.plugin))
        .map(info => ({plugin: info.plugin, module: context(info.key)}));
    }
    return loaded;
  };
}

const loaders = mapValues(contextMap, createLoader);

/**
 * Returns the config object of given plugin.
 */
function getConfig(plugin) {
  return loaders.configs().filter(o => o.plugin === plugin)[0].module;
}

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, props = {}) {
  return loaders.components()
    .map((o, i) => ({
      component: o.module,
      props: {...getConfig(o.plugin), ...props, key: i},
    }))
    .filter(o => o.props.slot === slot)
    .map(o => React.createElement(o.component, o.props));
}

// actions is a map of redux actions .
export const actions = merge(...loaders.actions().map(o => ({...o.module})));

// reducers is a map of redux reducers.
export const reducers = merge(...loaders.reducers().map(o => ({...o.module})));

// queriesAndMutators is an array of graphQL queries and mutators.
export const queriesAndMutators = flatten(loaders.graph().map(o => values(o.module)));

