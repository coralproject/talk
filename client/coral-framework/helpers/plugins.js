import React from 'react';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import plugins from 'pluginsConfig';

const components = flatten(
  plugins
    .map(o => o.module.components)
    .filter(o => o)
);

export const pluginReducers = merge(
  ...plugins
    .filter(o => o.module.reducer)
    .map(o => ({...o.module.reducer}))
);

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, props = {}) {
  return components
    .map((component, i) => ({
      component,
      props: {...props, key: i},
    }))
    .filter(o => o.component.slot === slot)
    .map(o => React.createElement(o.component, o.props));
}
