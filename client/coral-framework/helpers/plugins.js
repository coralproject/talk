import React from 'react';
import uniq from 'lodash/uniq';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import flattenDeep from 'lodash/flattenDeep';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import mapValues from 'lodash/mapValues';
import {loadTranslations} from 'coral-framework/services/i18n';
import {injectReducers} from 'coral-framework/services/store';
import {getDisplayName} from 'coral-framework/helpers/hoc';
import camelize from './camelize';
import plugins from 'pluginsConfig';
import uuid from 'uuid/v4';

// This is returned for pluginConfig when it is empty.
const emptyConfig = {};

export function getSlotComponents(slot, reduxState, props = {}, queryData = {}) {
  const pluginConfig = reduxState.config.plugin_config || emptyConfig;
  return flatten(plugins

      // Filter out components that have slots and have been disabled in `plugin_config`
      .filter((o) => o.module.slots && (!pluginConfig || !pluginConfig[o.name] || !pluginConfig[o.name].disable_components))

      .filter((o) => o.module.slots[slot])
      .map((o) => o.module.slots[slot])
  )
    .filter((component) => {
      if(!component.isExcluded) {
        return true;
      }
      let resolvedProps = getSlotComponentProps(component, reduxState, props, queryData);
      if (component.mapStateToProps) {
        resolvedProps = {...resolvedProps, ...component.mapStateToProps(reduxState)};
      }
      return !component.isExcluded(resolvedProps);
    });
}

export function isSlotEmpty(slot, reduxState, props = {}, queryData = {}) {
  return getSlotComponents(slot, reduxState, props, queryData).length === 0;
}

// Memoize the warnings so we only show them once.
const memoizedWarnings = [];

function withWarnings(component, queryData) {
  if (process.env.NODE_ENV !== 'production') {

    // Show warnings when accessing queryData only when not in production.
    return mapValues(queryData, (value, key) => {

      // Keep null values..
      if (!queryData[key]) {
        return queryData[key];
      }
      return new Proxy(queryData[key], {
        get(target, name) {

          // Only care about the components defined in the plugins.
          if (component.talkPluginName) {
            const warning = `'${getDisplayName(component)}' of '${component.talkPluginName}' accessed '${key}.${name}' but did not define fragments using the withFragment HOC`;
            if (memoizedWarnings.indexOf(warning) === -1) {
              console.warn(warning);
              memoizedWarnings.push(warning);
            }
          }
          return queryData[key][name];
        }
      });
    });
  }

  return queryData;
}

/**
 * getSlotComponentProps calculate the props we would pass to the slot component.
 * query datas are only passed to the component if it is defined in `component.fragments`.
 */
export function getSlotComponentProps(component, reduxState, props, queryData) {
  const pluginConfig = reduxState.config.plugin_config || emptyConfig;
  return {
    ...props,
    config: pluginConfig,
    ...(
      component.fragments
      ? pick(queryData, Object.keys(component.fragments))
      : withWarnings(component, queryData)
    )
  };
}

/**
 * Returns React Elements for given slot.
 */
export function getSlotElements(slot, reduxState, props = {}, queryData = {}) {
  return getSlotComponents(slot, reduxState, props, queryData)
    .map((component, i) => {
      return React.createElement(component, {key: i, ...getSlotComponentProps(component, reduxState, props, queryData)});
    });
}

export function getSlotFragments(slot, part) {
  const components = uniq(flattenDeep(plugins
    .filter((o) => o.module.slots ? o.module.slots[slot] : false)
    .map((o) => o.module.slots[slot])
  ));

  const documents = components
    .map((c) => c.fragments)
    .filter((fragments) => fragments && fragments[part])
    .reduce((res, fragments) => {
      res.push(fragments[part]);
      return res;
    }, []);

  return documents;
}

export function getGraphQLExtensions() {
  return plugins
    .map((o) => pick(o.module, ['mutations', 'queries', 'fragments']))
    .filter((o) => !isEmpty(o));
}

export function getModQueueConfigs() {
  return merge(...plugins
    .map((o) => o.module.modQueues)
    .filter((o) => o));
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
      .map((o) => ({[camelize(o.name)] : o.module.reducer}))
  );
  injectReducers(reducers);
}

function addMetaDataToSlotComponents() {

  // Add talkPluginName to Slot Components.
  plugins.forEach((plugin) => {
    const slots = plugin.module.slots;
    slots && Object.keys(slots).forEach((slot) => {
      slots[slot].forEach((component) => {

        // Attach plugin name to the component
        component.talkPluginName = plugin.name;

        // Attach uuid to the component
        component.talkUuid = uuid();
      });
    });
  });
}

addMetaDataToSlotComponents();
