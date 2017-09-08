import * as React from 'react';
import {graphql} from 'react-apollo';
import {getDefinitionName, separateDataAndRoot, getResponseErrors} from '../utils';
import PropTypes from 'prop-types';
import hoistStatics from 'recompose/hoistStatics';

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
export default (document, config = {}) => hoistStatics((WrappedComponent) => {
  return class WithQuery extends React.Component {
    static contextTypes = {
      eventEmitter: PropTypes.object,
      graphqlRegistry: PropTypes.object,
    };

    // Lazily resolve fragments from graphRegistry to support circular dependencies.
    memoized = null;
    lastNetworkStatus = null;
    data = null;
    name = '';

    get graphqlRegistry() {
      return this.context.graphqlRegistry;
    }

    resolveDocument(documentOrCallback) {
      const document = typeof documentOrCallback === 'function'
        ? documentOrCallback(this.props, this.context)
        : documentOrCallback;
      return this.graphqlRegistry.resolveFragments(document);
    }

    emitWhenNeeded(data) {
      const {variables, networkStatus} = data;
      if (this.lastNetworkStatus === networkStatus) {
        return;
      }
      this.lastNetworkStatus = networkStatus;

      const status = networkStatusToString(networkStatus);

      const {root} = separateDataAndRoot(data);
      this.context.eventEmitter.emit(`query.${this.name}.${status}`, {variables, data: root});
    }

    nextData(data) {
      this.emitWhenNeeded(data);

      // If data was previously set, we update it in a immutable way.
      if (this.data) {
        if (this.data.networkStatus !== data.networkStatus ||
            this.data.loading !== data.loading ||
            this.data.error !== data.error ||
            this.data.variables !== data.variables) {
          this.data = {
            ...this.data,
            error: data.error,
            networkStatus: data.networkStatus,
            loading: data.loading,
            variables: data.variables,
          };
        }
      }
      else {

        // Set data for the first time.
        this.data = {
          error: data.error,
          variables: data.variables,
          networkStatus: data.networkStatus,
          loading: data.loading,
          startPolling: data.startPolling,
          stopPolling: data.stopPolling,
          refetch: data.refetch,
          updateQuery: data.updateQuery,
          subscribeToMore: (stmArgs) => {
            const resolvedDocument = this.resolveDocument(stmArgs.document);

            // Resolve document fragments before passing it to `apollo-client`.
            return data.subscribeToMore({
              ...stmArgs,
              document: resolvedDocument,
              onError: (err) => {
                if (stmArgs.onErr) {
                  return stmArgs.onErr(err);
                }
                throw err;
              },
            });
          },
          fetchMore: (lmArgs) => {
            const resolvedDocument = this.resolveDocument(lmArgs.query);
            const fetchName = getDefinitionName(resolvedDocument);
            this.context.eventEmitter.emit(
              `query.${this.name}.fetchMore.${fetchName}.begin`,
              {variables: lmArgs.variables});

            // Resolve document fragments before passing it to `apollo-client`.
            return data.fetchMore({
              ...lmArgs,
              query: resolvedDocument,
            })
              .then((res) => {
                this.context.eventEmitter.emit(
                  `query.${this.name}.fetchMore.${fetchName}.success`,
                  {variables: lmArgs.variables, data: res.data});
                return Promise.resolve(res);
              })
              .catch((err) => {
                this.context.eventEmitter.emit(
                  `query.${this.name}.fetchMore.${fetchName}.error`,
                  {variables: lmArgs.variables, error: err});
                throw err;
              });
          },
        };
      }
      return this.data;
    }

    wrappedConfig = {
      ...config,
      options: config.options || {},
      props: (args) => {
        const nextData = this.nextData(args.data);
        const {root} = separateDataAndRoot(args.data);
        if (config.props) {

          // Custom props, in this case we just pass the wrapped args to it.
          return config.props({...args, data: {...args.data, ...nextData}});
        }

        // Return our wrapped data with a separated root.
        return {...args, data: nextData, root};
      },
    };

    wrappedOptions = (data) => {
      const base = (typeof this.wrappedConfig.options === 'function')
        ? this.wrappedConfig.options(data)
        : this.wrappedConfig.options;
      const configs = this.graphqlRegistry.getQueryOptions(this.name);
      const reducerCallbacks =
        [base.reducer || ((i) => i)]
          .concat(...configs.map((cfg) => cfg.reducer))
          .filter((i) => i);

      const reducer = withSkipOnErrors(
        reducerCallbacks.reduce(
          (a, b) => (prev, ...rest) => {
            const next = a(prev, ...rest);
            return b(next, ...rest) || next;
          }
        ));

      return {
        ...base,
        reducer,
      };
    };

    getWrapped = () => {
      if (!this.memoized) {
        const resolvedDocument = this.resolveDocument(document);
        this.name = getDefinitionName(resolvedDocument);
        this.memoized = graphql(
          resolvedDocument,
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
});
