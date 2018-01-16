import * as React from 'react';
import { graphql } from 'react-apollo';
import merge from 'lodash/merge';
import uniq from 'lodash/uniq';
import flatten from 'lodash/flatten';
import isEmpty from 'lodash/isEmpty';
import { getDefinitionName, getResponseErrors } from '../utils';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import hoistStatics from 'recompose/hoistStatics';
import union from 'lodash/union';

class ResponseErrors extends Error {
  constructor(errors) {
    super(`Response Errors ${JSON.stringify(errors)}`);
    this.errors = errors.map(e => new ResponseError(e));
  }
}

class ResponseError {
  constructor(error) {
    Object.assign(this, error);
  }

  translate(...args) {
    return t(`error.${this.translation_key}`, ...args);
  }
}

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply mutation options registered in the graphRegistry.
 */
export default (document, config = {}) =>
  hoistStatics(WrappedComponent => {
    config = {
      ...config,
      options: config.options || {},
      props: config.props || (data => ({ mutate: data.mutate() })),
    };

    return class WithMutation extends React.Component {
      static contextTypes = {
        eventEmitter: PropTypes.object,
        store: PropTypes.object,
        graphql: PropTypes.object,
      };

      get graphqlRegistry() {
        return this.context.graphql.registry;
      }

      resolveDocument(documentOrCallback) {
        return this.context.graphql.resolveDocument(
          documentOrCallback,
          this.props,
          this.context
        );
      }

      // Lazily resolve fragments from graphRegistry to support circular dependencies.
      memoized = null;

      // Props as we would pass to the BaseComponent without optimizations.
      dynamicProps = {};

      // Props that are optimized by keeping the identity of function callbacks.
      staticProps = {};

      propsWrapper = data => {
        const name = getDefinitionName(document);
        const callbacks = this.graphqlRegistry.getMutationOptions(name);
        const mutate = base => {
          const variables = base.variables || config.options.variables;
          const configs = callbacks.map(cb =>
            cb({ variables, state: this.context.store.getState() })
          );

          const optimisticResponse = merge(
            base.optimisticResponse || config.options.optimisticResponse,
            ...configs.map(cfg => cfg.optimisticResponse)
          );

          const refetchQueries = flatten(
            uniq(
              [
                base.refetchQueries || config.options.refetchQueries,
                ...configs.map(cfg => cfg.refetchQueries),
              ].filter(i => i)
            )
          );

          const updateCallbacks = [base.update || config.options.update]
            .concat(...configs.map(cfg => cfg.update))
            .filter(i => i);

          const update = (proxy, result) => {
            if (getResponseErrors(result)) {
              // Do not run updates when we have mutation errors.
              return;
            }
            updateCallbacks.forEach(cb => cb(proxy, result));
          };

          const updateQueries = [
            base.updateQueries || config.options.updateQueries,
            ...configs.map(cfg => cfg.updateQueries),
          ]
            .filter(i => i)
            .reduce((res, map) => {
              Object.keys(map).forEach(key => {
                if (!(key in res)) {
                  res[key] = (prev, result) => {
                    if (getResponseErrors(result.mutationResult)) {
                      // Do not run updates when we have mutation errors.
                      return prev;
                    }
                    return map[key](prev, result) || prev;
                  };
                } else {
                  const existing = res[key];
                  res[key] = (prev, result) => {
                    if (getResponseErrors(result.mutationResult)) {
                      // Do not run updates when we have mutation errors.
                      return prev;
                    }
                    const next = existing(prev, result);
                    return map[key](next, result) || next;
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

          this.context.eventEmitter.emit(`mutation.${name}.begin`, {
            variables,
          });

          return data
            .mutate(wrappedConfig)
            .then(res => {
              const errors = getResponseErrors(res);
              if (errors) {
                throw new ResponseErrors(errors);
              }
              this.context.eventEmitter.emit(`mutation.${name}.success`, {
                variables,
                data: res.data,
              });
              return Promise.resolve(res);
            })
            .catch(error => {
              this.context.eventEmitter.emit(`mutation.${name}.error`, {
                variables,
                error,
              });
              throw error;
            });
        };

        // Save current props to `dynamicProps`
        this.dynamicProps = config.props({ ...data, mutate });

        // Sync props to `staticProps`.
        // `staticProps` ultimately contains the same props as `dynamicProps` but all callbacks
        // keep their identity.
        union(
          Object.keys(this.dynamicProps),
          Object.keys(this.staticProps)
        ).forEach(key => {
          if (!(key in this.dynamicProps)) {
            delete this.staticProps[key];
            return;
          }
          if (typeof this.dynamicProps[key] !== 'function') {
            this.staticProps[key] = this.dynamicProps[key];
            return;
          }

          if (!(key in this.staticProps)) {
            this.staticProps[key] = (...args) =>
              this.dynamicProps[key](...args);
            return;
          }
        });
        return this.staticProps;
      };

      getWrapped = () => {
        if (!this.memoized) {
          this.memoized = graphql(this.resolveDocument(document), {
            ...config,
            props: this.propsWrapper,
          })(WrappedComponent);
        }
        return this.memoized;
      };

      render() {
        const Wrapped = this.getWrapped();
        return <Wrapped {...this.props} />;
      }
    };
  });
