import React from 'react';
import values from 'lodash/values';
import flatten from 'lodash/flatten';
import merge from 'lodash/merge';
import plugins from 'pluginsConfig';

/**
 * Returns the config object of given plugin.
 */
function getConfig(plugin) {
  return plugins.configs.filter(o => o.plugin === plugin)[0].module();
}

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, props = {}) {
  return plugins.components
    .map((o, i) => ({
      component: o.module(),
      props: {...getConfig(o.plugin), ...props, key: i},
    }))
    .filter(o => o.props.slot === slot)
    .map(o => React.createElement(o.component, o.props));
}

// actions is a map of redux actions .
export const actions = merge(...plugins.actions.map(o => ({...o.module()})));

// reducers is a map of redux reducers.
export const reducers = merge(...plugins.reducers.map(o => ({...o.module()})));

// queriesAndMutators is an array of graphQL queries and mutators.
export const queriesAndMutators = flatten(
  merge(
    plugins.queries.map(o => values(o.module())),
    plugins.mutators.map(o => values(o.module())),
  )
);

