import { createStore } from './store';
import { createClient, apolloErrorReporter } from './client';
import pym from './pym';
import EventEmitter from 'eventemitter2';
import { createReduxEmitter } from './events';
import { createRestClient } from './rest';
import thunk from 'redux-thunk';
import { loadTranslations } from './i18n';
import bowser from 'bowser';
import noop from 'lodash/noop';
import { BASE_PATH } from 'coral-framework/constants/url';
import { createPluginsService } from './plugins';
import { createNotificationService } from './notification';
import { createGraphQLRegistry } from './graphqlRegistry';
import { createGraphQLService } from './graphql';
import globalFragments from 'coral-framework/graphql/fragments';
import {
  createStorage,
  createPymStorage,
} from 'coral-framework/services/storage';
import { createHistory } from 'coral-framework/services/history';
import { createIntrospection } from 'coral-framework/services/introspection';
import introspectionData from 'coral-framework/graphql/introspection.json';

/**
 * getStaticConfiguration will return a singleton of the static configuration
 * object provided via a JSON DOM element.
 */
const getStaticConfiguration = (() => {
  let staticConfiguration = null;
  return () => {
    if (staticConfiguration != null) {
      return staticConfiguration;
    }

    const configElement = document.querySelector('#data');

    staticConfiguration = JSON.parse(
      configElement ? configElement.textContent : '{}'
    );

    return staticConfiguration;
  };
})();

/**
 * getAuthToken returns the active auth token or null
 *   Note: this method does not have access to the cookie based token used by
 *   browsers that don't allow us to use cross domain iframe local storage.
 * @return {string|null}
 */
const getAuthToken = (store, storage) => {
  let state = store.getState();

  if (state.config.auth_token) {
    // if an auth_token exists in config, use it.
    return state.config.auth_token;
  } else if (!bowser.safari && !bowser.ios && storage) {
    // Use local storage auth tokens where there's a stable api.
    return storage.getItem('token');
  }

  return null;
};

/**
 * createContext setups and returns Talk dependencies that should be
 * passed to `TalkProvider`.
 * @param  {Object}   [config]                    configuration
 * @param  {Object}   [config.reducers]           extra reducers to add to redux
 * @param  {Array}    [config.pluginsConfig]      plugin configuration as returned by importing pluginsConfig
 * @param  {Object}   [config.graphqlExtensions]  additional extension to the graphql framework
 * @param  {Object}   [config.notification]       replace default notification service
 * @param  {Function} [config.init]               run initialization e.g. to hydrate redux store
 * @param  {Function} [config.preInit]            same as init but run and resolve before init and plugins init
 * @return {Object}                               context
 */
export async function createContext({
  reducers = {},
  pluginsConfig = [],
  graphqlExtension = {},
  notification,
  preInit,
  init = noop,
} = {}) {
  const eventEmitter = new EventEmitter({ wildcard: true });
  const storage = createStorage();
  const pymStorage = createPymStorage(pym);
  const history = createHistory(BASE_PATH);
  const introspection = createIntrospection(introspectionData);
  let store = null;
  const token = () => {
    // Try to get the token from localStorage. If it isn't here, it may
    // be passed as a cookie.

    // NOTE: THIS IS ONLY EVER EVALUATED ONCE, IN ORDER TO SEND A DIFFERNT
    // TOKEN YOU MUST DISCONNECT AND RECONNECT THE WEBSOCKET CLIENT.
    return getAuthToken(store, storage);
  };

  const rest = createRestClient({
    uri: `${BASE_PATH}api/v1`,
    token,
  });

  // Try to get an overrided liveUri from the static config, if none is found,
  // build it.
  let { LIVE_URI: liveUri } = getStaticConfiguration();
  if (liveUri == null) {
    // The protocol must match the origin protocol, secure/insecure.
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

    // Compose the live url from this protocol, the current host + base path
    // with the live path appended to it.
    liveUri = `${protocol}://${location.host}${BASE_PATH}api/v1/live`;
  }

  const client = createClient({
    uri: `${BASE_PATH}api/v1/graph/ql`,
    liveUri,
    token,
    introspectionData,
  });
  const plugins = createPluginsService(pluginsConfig);
  const graphql = createGraphQLService(
    createGraphQLRegistry(plugins.getSlotFragments.bind(plugins))
  );
  if (!notification) {
    // Use default notification service (pym based)
    notification = createNotificationService(pym);
  }

  const context = {
    client,
    pym,
    plugins,
    eventEmitter,
    rest,
    graphql,
    notification,
    storage,
    history,
    introspection,
    pymStorage,
  };

  // Load framework fragments.
  Object.keys(globalFragments).forEach(key =>
    graphql.registry.addFragment(key, globalFragments[key])
  );

  // Register graphql extension
  graphql.registry.add(graphqlExtension);

  // Register plugin graphql extensions.
  plugins.getGraphQLExtensions().forEach(ext => graphql.registry.add(ext));

  // Load plugin translations.
  plugins.getTranslations().forEach(t => loadTranslations(t));

  // Pass any events through our parent.
  eventEmitter.onAny((eventName, value) => {
    pym.sendMessage('event', JSON.stringify({ eventName, value }));
  });

  // Create our redux store.
  const finalReducers = {
    ...reducers,
    ...plugins.getReducers(),
  };

  store = createStore(finalReducers, [
    thunk.withExtraArgument(context),
    createReduxEmitter(eventEmitter),
  ]);

  context.store = store;

  // Create apollo redux store.
  context.apolloStore = createStore(
    {
      apollo: client.reducer(),
    },
    [client.middleware(), apolloErrorReporter, createReduxEmitter(eventEmitter)]
  );

  // Run pre initialization.
  if (preInit) {
    await preInit(context);
  }

  // Run initialization.
  await Promise.all([init(context), plugins.executeInit(context)]);
  return context;
}
