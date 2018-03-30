import React from 'react';
import uniq from 'lodash/uniq';
import pick from 'lodash/pick';
import merge from 'lodash/merge';
import flattenDeep from 'lodash/flattenDeep';
import isEmpty from 'lodash/isEmpty';
import flatten from 'lodash/flatten';
import mapValues from 'lodash/mapValues';
import get from 'lodash/get';
import values from 'lodash/values';
import { getDisplayName } from 'coral-framework/helpers/hoc';
import camelize from '../helpers/camelize';

// This is returned for pluginsConfig when it is empty.
const emptyConfig = {};

// Memoize the warnings so we only show them once.
const memoizedWarnings = [];

// withWarnings decorates the props of queryData with a proxy that
// prints a warning when accessing deeper props.
function withWarnings(component, queryData) {
  if (process.env.NODE_ENV !== 'production' && window.Proxy) {
    // Show warnings when accessing queryData only when not in production.
    return mapValues(queryData, (value, key) => {
      // Keep null values..
      if (!queryData[key]) {
        return queryData[key];
      }
      return new Proxy(queryData[key], {
        get(target, name) {
          // Detect access from React DevTools and ignore those.
          const error = new Error();
          const accessFromDevTools = ['backend.js', 'dehydrate'].every(
            keyword => error.stack && error.stack.includes(keyword)
          );

          // Only care about the components defined in the plugins.
          if (component.talkPluginName && !accessFromDevTools) {
            const warning = `'${getDisplayName(component)}' of '${
              component.talkPluginName
            }' accessed '${key}.${name}' but did not define fragments using the withFragment HOC`;
            if (memoizedWarnings.indexOf(warning) === -1) {
              console.warn(warning);
              memoizedWarnings.push(warning);
            }
          }
          return queryData[key][name];
        },
      });
    });
  }

  return queryData;
}

function addMetaDataToSlotComponents(plugins) {
  // Add talkPluginName to Slot Components.
  plugins.forEach(plugin => {
    const slots = plugin.module.slots;
    slots &&
      Object.keys(slots).forEach(slot => {
        slots[slot].forEach(component => {
          // Attach plugin name to the component
          component.talkPluginName = plugin.name;
        });
      });
  });
}

/**
 * getSlotComponentProps calculate the props we would pass to the slot component.
 * query datas are only passed to the component if it is defined in `component.fragments`.
 */
function getSlotComponentProps(component, reduxState, props, queryData) {
  const pluginsConfig = get(reduxState, 'config.plugins_config') || emptyConfig;
  return {
    ...props,
    config: pluginsConfig,
    ...(component.fragments
      ? pick(queryData, Object.keys(component.fragments))
      : withWarnings(component, queryData)),
  };
}

/**
 *  splitProps detects objects coming from the query and
 *  returns `queryData` and `rest`. We use `__typename`
 *  in order to detect objects from the query.
 */
function splitProps(props) {
  const rest = { ...props };
  const queryData = {};
  Object.keys(props).forEach(k => {
    if (
      get(props[k], `__typename`) ||
      get(props[k], `0.__typename`) // Arrays
    ) {
      queryData[k] = props[k];
      delete rest[k];
    }
  });
  return { queryData, rest };
}

class PluginsService {
  constructor(plugins) {
    this.plugins = plugins;
    addMetaDataToSlotComponents(plugins);
  }

  isSlotEmpty(slot, reduxState, props = {}) {
    return this.getSlotElements(slot, reduxState, props).length === 0;
  }

  /**
   * Returns props that would pass to the given slot component.
   */
  getSlotComponentProps(component, reduxState, props) {
    const { queryData, rest } = splitProps(props);
    return getSlotComponentProps(component, reduxState, rest, queryData);
  }

  /**
   * Returns React Elements for given slot.
   */
  getSlotElements(slot, reduxState, props = {}, options = {}) {
    const pluginsConfig =
      get(reduxState, 'config.plugins_config') || emptyConfig;
    const { size = 0 } = options;
    const { queryData, rest } = splitProps(props);

    const isDisabled = component => {
      if (
        pluginsConfig &&
        pluginsConfig[component.talkPluginName] &&
        pluginsConfig[component.talkPluginName].disable_components
      ) {
        return true;
      }

      // Check if component is excluded.
      if (component.isExcluded) {
        let resolvedProps = getSlotComponentProps(
          component,
          reduxState,
          rest,
          queryData
        );
        if (component.mapStateToProps) {
          resolvedProps = {
            ...resolvedProps,
            ...component.mapStateToProps(reduxState),
          };
        }
        return component.isExcluded(resolvedProps);
      }

      return false;
    };

    const slots = flatten(
      this.plugins
        .filter(o => o.module.slots && o.module.slots[slot])
        .map(o => o.module.slots[slot])
    );

    if (size > 0 && slots.length > size) {
      console.warn(
        `Slot[${slot}] supports a maximum of ${size} plugins providing slots, got ${
          slots.length
        }, will only use the first ${size}`
      );
    }

    /**
     * This adds a consistent keying for the slot elements.
     * It uses the plugin name as the key. If the same plugin inserts
     * multiple elements it will append `.${noOfOccurence}` to the
     * key starting with the second element.
     */
    const getKey = (() => {
      const map = {};
      return component => {
        if (map[component.talkPluginName] === undefined) {
          map[component.talkPluginName] = 0;
        } else {
          map[component.talkPluginName]++;
        }
        const i = map[component.talkPluginName];
        return `${component.talkPluginName}${i > 0 ? `.${i}` : ''}`;
      };
    })();

    return (size > 0 ? slots.slice(0, size) : slots)
      .map(component => ({
        component,
        disabled: isDisabled(component),
        key: getKey(component),
      }))
      .filter(o => !o.disabled)
      .map(({ component, key }) =>
        React.createElement(component, {
          key,
          ...getSlotComponentProps(component, reduxState, rest, queryData),
        })
      );
  }

  getSlotFragments(slot, part) {
    const components = uniq(
      flattenDeep(
        this.plugins
          .filter(o => (o.module.slots ? o.module.slots[slot] : false))
          .map(o => o.module.slots[slot])
      )
    );

    const documents = components
      .map(c => c.fragments)
      .filter(fragments => fragments && fragments[part])
      .reduce((res, fragments) => {
        res.push(fragments[part]);
        return res;
      }, []);

    return documents;
  }

  getGraphQLExtensions() {
    return flatten(
      this.plugins.map(o => {
        const extension = pick(o.module, ['mutations', 'queries', 'fragments']);
        // Include extension defined in Slot Components.
        const slotComponentExtensions = !o.module.slots
          ? []
          : flatten(values(o.module.slots)).map(cmp => cmp.graphqlExtension);
        return [extension, ...slotComponentExtensions];
      })
    ).filter(o => !isEmpty(o));
  }

  getModQueueConfigs() {
    return merge(...this.plugins.map(o => o.module.modQueues).filter(o => o));
  }

  getTranslations() {
    return this.plugins.map(o => o.module.translations).filter(o => o);
  }

  getReducers() {
    return merge(
      ...this.plugins
        .filter(o => o.module.reducer)
        .map(o => ({ [camelize(o.name)]: o.module.reducer }))
    );
  }

  async executeInit(context) {
    const results = this.plugins
      .map(o => o.module.init)
      .filter(fn => fn)
      .map(fn => fn(context));
    await Promise.all(results);
  }
}

/**
 * createPluginsService returns a plugins service.
 * @param  {Array}   plugins config as returned from importing `pluginsConfig`
 * @return {Object}  plugins service
 */
export function createPluginsService(pluginsConfig) {
  return new PluginsService(pluginsConfig);
}
