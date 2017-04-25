import React from 'react';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import plugins from 'pluginsConfig';
import {gql} from 'react-apollo';

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

function getComponentFragments(components) {
  return components
    .map(c => c.fragments)
    .filter(fragments => fragments)
    .reduce((res, fragments) => {
      Object.keys(fragments).forEach(key => {
        if (!(key in res)) {
          res[key] = {names: '', definitions: ''};
        }
        res[key].names += `...${fragments[key].definitions[0].name.value}\n`;
        res[key].definitions = gql`${res[key].definitions}${fragments[key]}`;
      });
      return res;
    }, {});
}

export function getSlotsFragments(slots) {
  if (!Array.isArray(slots)) {
    slots = [slots];
  }
  const components = uniq(flattenDeep(slots.map(slot => {
    return plugins
    .filter(o => o.module.slots[slot])
    .map(o => o.module.slots[slot]);
  })));

  return getComponentFragments(components);
}

