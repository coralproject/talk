import React from 'react';
import merge from 'lodash/merge';
import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import uniq from 'lodash/uniq';
import plugins from 'pluginsConfig';
import {gql} from 'react-apollo';
import {getDefinitionName} from 'coral-framework/utils';

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
          res[key] = {spreads: '', definitions: ''};
        }
        res[key].spreads += `...${getDefinitionName(fragments[key])}\n`;
        res[key].definitions = gql`${res[key].definitions}${fragments[key]}`;
      });
      return res;
    }, {});
}

/**
 * @returns {[key]: {spreads: string, definitions: AST}}
 */
export function getSlotsFragments(slots) {
  if (!Array.isArray(slots)) {
    slots = [slots];
  }
  const components = uniq(flattenDeep(slots.map(slot => {
    return plugins
    .filter(o => o.module.slots[slot])
    .map(o => o.module.slots[slot]);
  })));

  const fragments = getComponentFragments(components);
  return {
    spreads(key) {
      return fragments[key] && fragments[key].spreads;
    },
    definitions(key) {
      return fragments[key] && fragments[key].definitions;
    },
  };
}

