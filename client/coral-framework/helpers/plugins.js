import React from 'react';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import merge from 'lodash/merge';
import plugins from 'pluginsConfig';

/**
 * Returns the config object of given plugin.
 */
function getConfig(plugin) {
  return plugins.configs.filter(o => o.plugin === plugin)[0].getModule();
}

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, props = {}) {
  return plugins.components
    .map((o, i) => ({
      component: o.getModule(),
      props: {...getConfig(o.plugin), ...props, key: i},
    }))
    .filter(o => o.props.slot === slot)
    .map(o => React.createElement(o.component, o.props));
}

// Returns a map of redux actions.
export function getPluginActions() {
  return merge(...plugins.actions.map(o => ({...o.getModule()})));
}

// Returns a map of redux reducers.
export function getPluginReducers() {
  merge(...plugins.reducers.map(o => ({...o.getModule()})));
}

// Returns an array of graphQL queries and mutators.
export function getPluginQueriesAndMutators() {
  return flatten(
    merge(
      plugins.queries.map(o => values(o.getModule())),
      plugins.mutators.map(o => values(o.getModule())),
    )
  );
}
