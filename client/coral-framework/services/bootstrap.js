import {createStore} from './store';
import {createClient, apolloErrorReporter} from './client';
import pym from './pym';
import EventEmitter from 'eventemitter2';
import {createReduxEmitter} from './events';
import {createRestClient} from './rest';
import thunk from 'redux-thunk';
import {loadTranslations} from './i18n';
import bowser from 'bowser';
import {BASE_PATH} from 'coral-framework/constants/url';
import {createPluginsService} from './plugins';
import {createNotificationService} from './notification';
import {createGraphQLRegistry} from './graphqlRegistry';
import globalFragments from 'coral-framework/graphql/fragments';
import {createStorage} from 'coral-framework/services/storage';
import {createHistory} from 'coral-framework/services/history';

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
 * @param  {Object} [config]                    configuration
 * @param  {Object} [config.reducers]           extra reducers to add to redux
 * @param  {Array}  [config.pluginsConfig]      plugin configuration as returned by importing pluginsConfig
 * @param  {Object} [config.graphqlExtensions]  additional extension to the graphql framework
 * @param  {Object} [config.notification]       replace default notification service
 * @return {Object}                             context
 */
export function createContext({reducers = {}, pluginsConfig = [], graphqlExtension = {}, notification} = {}) {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const eventEmitter = new EventEmitter({wildcard: true});
  const storage = createStorage();
  const history = createHistory(BASE_PATH);
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
  const client = createClient({
    uri: `${BASE_PATH}api/v1/graph/ql`,
    liveUri: `${protocol}://${location.host}${BASE_PATH}api/v1/live`,
    token,
  });
  const plugins = createPluginsService(pluginsConfig);
  const graphqlRegistry = createGraphQLRegistry(plugins.getSlotFragments.bind(plugins));
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
    graphqlRegistry,
    notification,
    storage,
    history,
  };

  // Load framework fragments.
  Object.keys(globalFragments).forEach((key) => graphqlRegistry.addFragment(key, globalFragments[key]));

  // Register graphql extension
  graphqlRegistry.add(graphqlExtension);

  // Register plugin graphql extensions.
  plugins.getGraphQLExtensions().forEach((ext) => graphqlRegistry.add(ext));

  // Load plugin translations.
  plugins.getTranslations().forEach((t) => loadTranslations(t));

  // Pass any events through our parent.
  eventEmitter.onAny((eventName, value) => {
    pym.sendMessage('event', JSON.stringify({eventName, value}));
  });

  const finalReducers = {
    ...reducers,
    ...plugins.getReducers(),
    apollo: client.reducer(),
  };

  store = createStore(finalReducers, [
    client.middleware(),
    thunk.withExtraArgument(context),
    apolloErrorReporter,
    createReduxEmitter(eventEmitter),
  ]);

  return {
    ...context,
    store,
  };
}
