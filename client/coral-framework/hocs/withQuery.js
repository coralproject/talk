import * as React from 'react';
import {graphql} from 'react-apollo';
import {getQueryOptions, resolveFragments} from 'coral-framework/services/graphqlRegistry';
import {getDefinitionName, separateDataAndRoot} from '../utils';

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply query options registered in the graphRegistry.
 */
export default (document, config) => WrappedComponent => {
  config = {
    ...config,
    options: config.options || {},
    props: config.props || (({data}) => separateDataAndRoot(data)),
  };

  const wrappedOptions = (data) => {
    const base = (typeof config.options === 'function') ? config.options(data) : config.options;
    const name = getDefinitionName(document);
    const configs = getQueryOptions(name);
    const reducerCallbacks =
      [base.reducer || (i => i)]
      .concat(...configs.map(cfg => cfg.reducer))
      .filter(i => i);

    const reducer = reducerCallbacks.reduce(
      (a, b) => (prev, ...rest) =>
        b(a(prev, ...rest), ...rest),
    );

    return {
      ...base,
      reducer,
    };
  };

  let memoized = null;
  const getWrapped = () => {
    if (!memoized) {
      memoized = graphql(resolveFragments(document), {...config, options: wrappedOptions})(WrappedComponent);
    }
    return memoized;
  };

  return (props) => {
    const Wrapped = getWrapped();
    return <Wrapped {...props} />;
  };
};
