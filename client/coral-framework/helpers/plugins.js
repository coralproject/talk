import React from 'react';
import uniq from 'lodash/uniq';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import plugins from 'pluginsConfig';
import flatten from 'lodash/flatten';
import flattenDeep from 'lodash/flattenDeep';
import {getDefinitionName, mergeDocuments} from 'coral-framework/utils';
import {loadTranslations} from 'coral-framework/services/i18n';
import {injectReducers} from 'coral-framework/services/store';

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, props = {}) {
  const components = flatten(plugins
    .filter((o) => o.module.slots[slot])
    .map((o) => o.module.slots[slot]));
  return components
    .map((component, i) => React.createElement(component, {key: i, ...props}));
}

function getComponentFragments(components) {
  const res = components
    .map((c) => c.fragments)
    .filter((fragments) => fragments)
    .reduce((res, fragments) => {
      Object.keys(fragments).forEach((key) => {
        if (!(key in res)) {
          res[key] = {spreads: [], definitions: []};
        }
        res[key].spreads.push(getDefinitionName(fragments[key]));
        res[key].definitions.push(fragments[key]);
      });
      return res;
    }, {});

  Object.keys(res).forEach((key) => {

    // Assemble arguments for `gql` to call it directly without using template literals.
    res[key].spreads = `...${res[key].spreads.join('\n...')}\n`;
    res[key].definitions = mergeDocuments(res[key].definitions);
  });

  return res;
}

/**
 * Returns an object that can be used to compose fragments or queries.
 *
 * Example:
 * const pluginFragments = getSlotsFragments(['commentInfoBar', 'commentActions']);
 * const rootFragment = gql`
 *   fragment Comment_root on RootQuery {
 +     ${pluginFragments.spreads('root')}
 *   }
 *   ${pluginFragments.definitions('root')}
 * `;
 */
export function getSlotsFragments(slots) {
  if (!Array.isArray(slots)) {
    slots = [slots];
  }
  const components = uniq(flattenDeep(slots.map((slot) => {
    return plugins
    .filter((o) => o.module.slots[slot])
    .map((o) => o.module.slots[slot]);
  })));

  const fragments = getComponentFragments(components);
  return {
    spreads(key) {
      return (fragments[key] && fragments[key].spreads) || '';
    },
    definitions(key) {
      return (fragments[key] && fragments[key].definitions) || '';
    },
  };
}

export function getGraphQLExtensions() {
  return plugins
    .map((o) => pick(o.module, ['mutations', 'queries', 'fragments']))
    .filter((o) => o);
}

function getTranslations() {
  return plugins
    .map((o) => o.module.translations)
    .filter((o) => o);
}

export function loadPluginsTranslations() {
  getTranslations().forEach((t) => loadTranslations(t));
}

export function injectPluginsReducers() {
  const reducers = merge(
    ...plugins
      .filter((o) => o.module.reducer)
      .map((o) => ({[o.plugin] : o.module.reducer}))
  );
  injectReducers(reducers);
}
