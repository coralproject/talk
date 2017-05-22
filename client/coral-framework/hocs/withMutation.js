import * as React from 'react';
import {graphql} from 'react-apollo';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import {getMutationOptions, resolveFragments} from 'coral-framework/services/graphqlRegistry';
import {store} from 'coral-framework/services/store';
import {getDefinitionName, getResponseErrors} from '../utils';
import I18n from 'coral-framework/modules/i18n/i18n';
import translations from 'coral-framework/translations.json';
const lang = new I18n(translations);

class ResponseErrors extends Error {
  constructor(errors) {
    super(`Response Errors ${JSON.stringify(errors)}`);
    this.errors = errors.map((e) => new ResponseError(e));
  }
}

class ResponseError {
  constructor(error) {
    Object.assign(this, error);
  }

  translate(...args) {
    return lang.t(`error.${this.translation_key}`, ...args);
  }
}

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply mutation options registered in the graphRegistry.
 */
export default (document, config) => (WrappedComponent) => {
  config = {
    ...config,
    options: config.options || {},
    props: config.props || ((data) => ({mutate: data.mutate()})),
  };
  const wrappedProps = (data) => {
    const name = getDefinitionName(document);
    const callbacks = getMutationOptions(name);
    const mutate = (base) => {
      const variables = base.variables || config.options.variables;
      const configs = callbacks.map((cb) => cb({variables, state: store.getState()}));

      const optimisticResponse = merge(
        base.optimisticResponse || config.options.optimisticResponse,
        ...configs.map((cfg) => cfg.optimisticResponse),
      );

      const refetchQueries = flatten(uniq([
        base.refetchQueries || config.options.refetchQueries,
        ...configs.map((cfg) => cfg.refetchQueries),
      ].filter((i) => i)));

      const updateCallbacks =
        [base.update || config.options.update]
        .concat(...configs.map((cfg) => cfg.update))
        .filter((i) => i);

      const update = (proxy, result) => {
        if (getResponseErrors(result)) {

          // Do not run updates when we have mutation errors.
          return;
        }
        updateCallbacks.forEach((cb) => cb(proxy, result));
      };

      const updateQueries =
        [
          base.updateQueries || config.options.updateQueries,
          ...configs.map((cfg) => cfg.updateQueries)
        ]
        .filter((i) => i)
        .reduce((res, map) => {
          Object.keys(map).forEach((key) => {
            if (!(key in res)) {
              res[key] = (prev, result) => {
                if (getResponseErrors(result.mutationResult)) {

                  // Do not run updates when we have mutation errors.
                  return prev;
                }
                return map[key](prev, result);
              };
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
      if (isEmpty(wrappedConfig.optimisticResponse)) {
        delete wrappedConfig.optimisticResponse;
      }
      return data.mutate(wrappedConfig)
        .then((res) => {
          const errors = getResponseErrors(res);
          if (errors) {
            throw new ResponseErrors(errors);
          }
          return Promise.resolve(res);
        });
    };
    return config.props({...data, mutate});
  };

  // Lazily resolve fragments from graphRegistry to support circular dependencies.
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
