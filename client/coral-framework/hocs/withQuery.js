import {graphql} from 'react-apollo';
import {getQueryOptions} from 'coral-framework/services/registry';
import {getDefinitionName, separateDataAndRoot} from '../utils';

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply query options registered in the registry.
 */
export default (definitions, config) => WrappedComponent => {
  config = {
    ...config,
    options: config.options || {},
    props: config.props || (({data}) => separateDataAndRoot(data)),
  };

  const wrappedOptions = (data) => {
    const base = (typeof config.options === 'function') ? config.options(data) : config.options;
    const name = getDefinitionName(definitions);
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

  const wrapped = graphql(definitions, {...config, options: wrappedOptions})(WrappedComponent);
  return wrapped;
};
