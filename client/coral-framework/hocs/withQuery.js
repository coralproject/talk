import * as React from 'react';
import { graphql } from 'react-apollo';
import {
  getDefinitionName,
  separateDataAndRoot,
  getResponseErrors,
} from '../utils';
import PropTypes from 'prop-types';
import hoistStatics from 'recompose/hoistStatics';
import { getOperationName } from 'apollo-client/queries/getFromAST';
import throttle from 'lodash/throttle';
import get from 'lodash/get';
import { notify } from 'coral-framework/actions/notification';
import { Broadcast } from 'react-broadcast';
import { compose } from 'recompose';

const withSkipOnErrors = reducer => (prev, action, ...rest) => {
  if (
    action.type === 'APOLLO_MUTATION_RESULT' &&
    getResponseErrors(action.result)
  ) {
    return prev;
  }
  return reducer(prev, action, ...rest);
};

function networkStatusToString(networkStatus) {
  switch (networkStatus) {
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
    default:
      throw new Error(`Unknown network status ${networkStatus}`);
  }
}

// When wrapped broadcast all data changes to channel "queryData".
const withBroadcaster = WrappedComponent => props => (
  /* eslint-disable react/prop-types */
  <Broadcast channel="queryData" value={props.data}>
    <WrappedComponent {...props} />
  </Broadcast>
  /* eslint-enable react/prop-types */
);

const createHOC = (document, config, { notifyOnError = true }) =>
  hoistStatics(WrappedComponent => {
    return class WithQuery extends React.Component {
      static contextTypes = {
        eventEmitter: PropTypes.object,
        graphql: PropTypes.object,
        client: PropTypes.object,
        store: PropTypes.object,
      };

      static propTypes = {
        notify: PropTypes.func,
      };

      // Lazily resolve fragments from graphRegistry to support circular dependencies.
      memoized = null;
      resolvedDocument = null;
      lastNetworkStatus = null;
      name = '';
      apolloData = null;
      data = null;

      // Pending subscription data.
      subscriptionQueue = [];

      get graphqlRegistry() {
        return this.context.graphql.registry;
      }

      get client() {
        return this.context.client;
      }

      resolveDocument(documentOrCallback) {
        return this.context.graphql.resolveDocument(
          documentOrCallback,
          this.props,
          this.context
        );
      }

      emitWhenNeeded(data) {
        const { variables, networkStatus } = data;
        if (this.lastNetworkStatus === networkStatus) {
          return;
        }
        this.lastNetworkStatus = networkStatus;

        const status = networkStatusToString(networkStatus);

        const { root } = separateDataAndRoot(data);
        this.context.eventEmitter.emit(`query.${this.name}.${status}`, {
          variables,
          data: root,
        });
      }

      // Handle any pending susbcription data in the subscription queue at max once every second.
      // Updates are batched in written into apollo in one go.
      processSubscriptionQueue = throttle(() => {
        if (!this.subscriptionQueue.length) {
          return;
        }
        const variables =
          typeof this.wrappedOptions === 'function'
            ? this.wrappedOptions(this.props).variables
            : this.wrappedOptions.variables;

        const previousResult = this.client.readQuery({
          query: this.resolvedDocument,
          variables,
        });

        let result = previousResult;

        this.subscriptionQueue.forEach(([updateQuery, data]) => {
          result = updateQuery(result, { subscriptionData: { data } });
        });

        if (result !== previousResult) {
          this.client.writeQuery({
            query: this.resolvedDocument,
            variables,
            data: result,
          });
        }
        this.subscriptionQueue = [];
      }, 1000);

      handleOnLoaded() {
        // Trigger subscription queue processing after query has loaded.
        setTimeout(() => this.processSubscriptionQueue(), 1000);
      }

      subscribeToMoreThrottled = ({ document, variables, updateQuery }) => {
        // We need to add the typenames and resolve fragments.
        const query = this.resolveDocument(document);
        const handler = (error, data) => {
          if (error) {
            // TODO: shuld this show a notification?
            console.error(error);
            return;
          }
          if (data) {
            this.subscriptionQueue.push([updateQuery, data]);

            // Only trigger handler when query has been loaded.
            if (!this.data.loading) {
              // Triggers the throttled subscription queue processor.
              this.processSubscriptionQueue();
            }
          }
        };

        // Start subscription.
        const request = {
          query,
          variables,
          operationName: getOperationName(query),
        };

        const id = this.client.networkInterface.subscribe(request, handler);

        // Return unsubscribe callback.
        return () => this.client.networkInterface.unsubscribe(id);
      };

      notifyErrors(messages) {
        this.context.store.dispatch(notify('error', messages));
      }

      nextData(data) {
        this.apolloData = data;
        this.emitWhenNeeded(data);

        if (
          get(data, 'error.message') &&
          get(this, 'data.error.message') !== get(data, 'error.message')
        ) {
          // Show errors as notifications.
          if (notifyOnError) {
            this.notifyErrors(data.error.message);
          }
        }

        // If data was previously set, we update it in a immutable way.
        if (this.data) {
          if (this.data.loading && !data.loading) {
            this.handleOnLoaded();
          }

          if (
            this.data.networkStatus !== data.networkStatus ||
            this.data.loading !== data.loading ||
            this.data.error !== data.error ||
            this.data.variables !== data.variables
          ) {
            this.data = {
              ...this.data,
              error: data.error,
              networkStatus: data.networkStatus,
              loading: data.loading,
              variables: data.variables,
            };
          }
        } else {
          // Set data for the first time.
          this.data = {
            error: data.error,
            variables: data.variables,
            networkStatus: data.networkStatus,
            loading: data.loading,
            subscribeToMoreThrottled: this.subscribeToMoreThrottled,
            startPolling: (...args) => {
              return this.apolloData.startPolling(...args);
            },
            stopPolling: (...args) => {
              return this.apolloData.stopPolling(...args);
            },
            updateQuery: (...args) => {
              return this.apolloData.updateQuery(...args);
            },
            refetch: (...args) => {
              return this.apolloData.refetch(...args);
            },
            subscribeToMore: stmArgs => {
              const resolvedDocument = this.resolveDocument(stmArgs.document);

              // Resolve document fragments before passing it to `apollo-client`.
              return this.apolloData.subscribeToMore({
                ...stmArgs,
                document: resolvedDocument,
                onError: err => {
                  if (stmArgs.onErr) {
                    return stmArgs.onErr(err);
                  }
                  throw err;
                },
              });
            },
            fetchMore: lmArgs => {
              const resolvedDocument = this.resolveDocument(lmArgs.query);
              const fetchName = getDefinitionName(resolvedDocument);
              this.context.eventEmitter.emit(
                `query.${this.name}.fetchMore.${fetchName}.begin`,
                { variables: lmArgs.variables }
              );

              // Resolve document fragments before passing it to `apollo-client`.
              return this.apolloData
                .fetchMore({
                  ...lmArgs,
                  query: resolvedDocument,
                })
                .then(res => {
                  this.context.eventEmitter.emit(
                    `query.${this.name}.fetchMore.${fetchName}.success`,
                    { variables: lmArgs.variables, data: res.data }
                  );
                  return Promise.resolve(res);
                })
                .catch(err => {
                  this.context.eventEmitter.emit(
                    `query.${this.name}.fetchMore.${fetchName}.error`,
                    { variables: lmArgs.variables, error: err }
                  );
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
        props: args => {
          const nextData = this.nextData(args.data);
          const { root } = separateDataAndRoot(args.data);

          if (config.props) {
            // Custom props, in this case we just pass the wrapped args to it.
            return config.props({
              ...args,
              data: { ...args.data, ...nextData },
            });
          }

          // Return our wrapped data with a separated root.
          return { ...args, data: nextData, root };
        },
      };

      wrappedOptions = data => {
        const base =
          typeof this.wrappedConfig.options === 'function'
            ? this.wrappedConfig.options(data)
            : this.wrappedConfig.options;
        const configs = this.graphqlRegistry.getQueryOptions(this.name);
        const reducerCallbacks = [base.reducer || (i => i)]
          .concat(...configs.map(cfg => cfg.reducer))
          .filter(i => i);

        const reducer = withSkipOnErrors(
          reducerCallbacks.reduce((a, b) => (prev, ...rest) => {
            const next = a(prev, ...rest);
            return b(next, ...rest) || next;
          })
        );

        return {
          ...base,
          reducer,
        };
      };

      getWrapped = () => {
        if (!this.memoized) {
          this.resolvedDocument = this.resolveDocument(document);
          this.name = getDefinitionName(this.resolvedDocument);
          this.memoized = compose(
            graphql(this.resolvedDocument, {
              ...this.wrappedConfig,
              options: this.wrappedOptions,
            }),
            withBroadcaster
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

/**
 * Exports a HOC with the same signature as `graphql`, that will
 * apply query options registered in the graphRegistry.
 *
 * The returned HOC accepts a settings object with the following properties:
 * notifyOnError: show a notification to the user when an error occured.
 *                Defaults to true.
 */
export default (document, config = {}) => settingsOrComponent => {
  if (typeof settingsOrComponent === 'function') {
    return createHOC(document, config, {})(settingsOrComponent);
  }
  return createHOC(document, config, settingsOrComponent);
};
