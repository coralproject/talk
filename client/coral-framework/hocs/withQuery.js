import * as React from 'react';
import {graphql} from 'react-apollo';
import {getQueryOptions, resolveFragments} from 'coral-framework/services/graphqlRegistry';
import {getDefinitionName, separateDataAndRoot, getResponseErrors} from '../utils';

const withSkipOnErrors = (reducer) => (prev, action, ...rest) => {
  if (action.type === 'APOLLO_MUTATION_RESULT' && getResponseErrors(action.result)) {
    return prev;
  }
  return reducer(prev, action, ...rest);
};

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply query options registered in the graphRegistry.
 */
export default (document, config = {}) => (WrappedComponent) => {
  const wrappedConfig = {
    ...config,
    options: config.options || {},
    props: (args) => {
      const wrappedArgs = {
        ...args,
        data: {
          ...args.data,
          subscribeToMore(stmArgs) {

            // Resolve document fragments before passing it to `apollo-client`.
            return args.data.subscribeToMore({
              ...stmArgs,
              document: resolveFragments(stmArgs.document),
            });
          },
          fetchMore(lmArgs) {

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

  const wrappedOptions = (data) => {
    const base = (typeof wrappedConfig.options === 'function')
      ? wrappedConfig.options(data)
      : wrappedConfig.options;
    const name = getDefinitionName(document);
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

  let memoized = null;
  const getWrapped = () => {
    if (!memoized) {
      memoized = graphql(resolveFragments(document), {...wrappedConfig, options: wrappedOptions})(WrappedComponent);
    }
    return memoized;
  };

  return (props) => {
    const Wrapped = getWrapped();
    return <Wrapped {...props} />;
  };
};
