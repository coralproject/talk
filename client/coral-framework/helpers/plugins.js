import React from 'react';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import plugins from 'pluginsConfig';

export const pluginReducers = merge(
  ...plugins
    .filter(o => o.module.reducer)
    .map(o => ({...o.module.reducer}))
);

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, props = {}) {
  const components = flatten(plugins
    .filter(o => o.module.slots[slot])
    .map(o => o.module.slots[slot]));
  return components
    .map((component, i) => React.createElement(component, {...props, key: i}));
}
