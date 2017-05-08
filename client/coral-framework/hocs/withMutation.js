import * as React from 'react';
import {graphql} from 'react-apollo';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import {getMutationOptions, resolveFragments} from 'coral-framework/services/registry';
import {store} from 'coral-framework/services/store';
import {getDefinitionName} from '../utils';

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply mutation options registered in the registry.
 */
export default (document, config) => WrappedComponent => {
  config = {
    ...config,
    options: config.options || {},
    props: config.props || (data => ({mutate: data.mutate()})),
  };
  const wrappedProps = (data) => {
    const name = getDefinitionName(document);
    const callbacks = getMutationOptions(name);
    const mutate = (base) => {
      const variables = base.variables || config.options.variables;
      const configs = callbacks.map(cb => cb({variables, state: store.getState()}));

      const optimisticResponse = merge(
        base.optimisticResponse || config.options.optimisticResponse,
        ...configs.map(cfg => cfg.optimisticResponse),
      );

      const refetchQueries = flatten(uniq([
        base.refetchQueries || config.options.refetchQueries,
        ...configs.map(cfg => cfg.refetchQueries),
      ].filter(i => i)));

      const updateCallbacks =
        [base.update || config.options.update]
        .concat(...configs.map(cfg => cfg.update))
        .filter(i => i);

      const update = (proxy, result) => {
        updateCallbacks.forEach(cb => cb(proxy, result));
      };

      const updateQueries =
        [
          base.updateQueries || config.options.updateQueries,
          ...configs.map(cfg => cfg.updateQueries)
        ]
        .filter(i => i)
        .reduce((res, map) => {
          Object.keys(map).forEach(key => {
            if (!(key in res)) {
              res[key] = map[key];
            } else {
              const existing = res[key];
              res[key] = (prev, result) => {
                const next = existing(prev, result);
                return map[key](next, result);
              };
            }
          });
          return res;
        }, {});

      const wrappedConfig = {
        variables,
        optimisticResponse,
        refetchQueries,
        updateQueries,
        update,
      };
      return data.mutate(wrappedConfig);
    };
    return config.props({...data, mutate});
  };

  // Lazily resolve fragments from registry to support circular dependencies.
  let memoized = null;
  const getWrapped = () => {
    if (!memoized) {
      memoized = graphql(resolveFragments(document), {...config, props: wrappedProps})(WrappedComponent);
    }
    return memoized;
  };

  return (props) => {
    const Wrapped = getWrapped();
    return <Wrapped {...props} />;
  };
};
