import * as React from 'react';
import {graphql} from 'react-apollo';
import {getQueryOptions, resolveFragments} from 'coral-framework/services/graphqlRegistry';
import {getDefinitionName, separateDataAndRoot, getResponseErrors} from '../utils';
import PropTypes from 'prop-types';

const withSkipOnErrors = (reducer) => (prev, action, ...rest) => {
  if (action.type === 'APOLLO_MUTATION_RESULT' && getResponseErrors(action.result)) {
    return prev;
  }
  return reducer(prev, action, ...rest);
};

function networkStatusToString(networkStatus) {
  switch(networkStatus) {
  case 1:
    return 'loading';
  case 2:
    return 'setVariables';
  case 3:
    return 'fetchMore';
  case 4:
    return 'refetch';
  case 6:
    return 'poll';
  case 7:
    return 'ready';
  case 8:
    return 'error';
  }
  throw new Error(`Unknown network status ${networkStatus}`);
}

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply query options registered in the graphRegistry.
 */
export default (document, config = {}) => (WrappedComponent) => {
  const name = getDefinitionName(document);

  return class WithQuery extends React.Component {
    static contextTypes = {
      eventEmitter: PropTypes.object,
    };

    // Lazily resolve fragments from graphRegistry to support circular dependencies.
    memoized = null;
    lastNetworkStatus = null;

    emitWhenNeeded(data) {
      const {variables, networkStatus} = data;
      if (this.lastNetworkStatus === networkStatus) {
        return;
      }
      this.lastNetworkStatus = networkStatus;

      const status = networkStatusToString(networkStatus);

      this.context.eventEmitter.emit(`query.${name}.${status}`, {variables, networkStatus});
    }

    wrappedConfig = {
      ...config,
      options: config.options || {},
      props: (args) => {
        this.emitWhenNeeded(args.data);

        const wrappedArgs = {
          ...args,
          data: {
            ...args.data,
            subscribeToMore: (stmArgs) => {
              const subscrName = getDefinitionName(stmArgs.document);
              this.context.eventEmitter.emit(
                `query.${name}.subscribeToMore.${subscrName}`,
                {variables: stmArgs.variables});

              // Resolve document fragments before passing it to `apollo-client`.
              return args.data.subscribeToMore({
                ...stmArgs,
                document: resolveFragments(stmArgs.document),
                onError: (err) => {
                  this.context.eventEmitter.emit(
                    `query.${name}.subscribeToMore.${subscrName}.error`,
                    {variables: stmArgs.variables});

                  if (stmArgs.onErr) {
                    return stmArgs.onErr(err);
                  }
                  throw err;
                },
              });
            },
            fetchMore: (lmArgs) => {
              const fetchName = getDefinitionName(lmArgs.query);
              this.context.eventEmitter.emit(
                `query.${name}.fetchMore.${fetchName}`,
                {variables: lmArgs.variables});

              // Resolve document fragments before passing it to `apollo-client`.
              return args.data.fetchMore({
                ...lmArgs,
                query: resolveFragments(lmArgs.query),
              });
            },
          },
        };
        return config.props
          ? config.props(wrappedArgs)
          : separateDataAndRoot(wrappedArgs.data);
      },
    };

    wrappedOptions = (data) => {
      const base = (typeof this.wrappedConfig.options === 'function')
        ? this.wrappedConfig.options(data)
        : this.wrappedConfig.options;
      const configs = getQueryOptions(name);
      const reducerCallbacks =
        [base.reducer || ((i) => i)]
        .concat(...configs.map((cfg) => cfg.reducer))
        .filter((i) => i);

      const reducer = withSkipOnErrors(
        reducerCallbacks.reduce(
          (a, b) => (prev, ...rest) =>
            b(a(prev, ...rest), ...rest),
        ));

      return {
        ...base,
        reducer,
      };
    };

    getWrapped = () => {
      if (!this.memoized) {
        this.memoized = graphql(
          resolveFragments(document),
          {...this.wrappedConfig, options: this.wrappedOptions},
        )(WrappedComponent);
      }
      return this.memoized;
    };

    render() {
      const Wrapped = this.getWrapped();
      return <Wrapped {...this.props} />;
    }
  };
};
