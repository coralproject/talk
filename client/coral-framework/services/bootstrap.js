import {createStore} from './store';
import {createClient, apolloErrorReporter} from './client';
import pym from './pym';
import EventEmitter from 'eventemitter2';
import {createReduxEmitter} from './events';
import {createRestClient} from './rest';
import thunk from 'redux-thunk';
import {loadTranslations} from './i18n';
import bowser from 'bowser';
import * as Storage from '../helpers/storage';
import {BASE_PATH} from 'coral-framework/constants/url';
import {createPluginsService} from './plugins';
import {createGraphQLRegistry} from './graphqlRegistry';
import globalFragments from 'coral-framework/graphql/fragments';

/**
 * getAuthToken returns the active auth token or null
 *   Note: this method does not have access to the cookie based token used by
 *   browsers that don't allow us to use cross domain iframe local storage.
 * @return {string|null}
 */
const getAuthToken = (store) => {
  let state = store.getState();

  if (state.config.auth_token) {

    // if an auth_token exists in config, use it.
    return state.config.auth_token;

  } else if (!bowser.safari && !bowser.ios) {

    // Use local storage auth tokens where there's a stable api.
    return Storage.getItem('token');
  }

  return null;
};

export function createContext({reducers = {}, pluginsConfig = [], graphqlExtension = {}}) {
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  const eventEmitter = new EventEmitter({wildcard: true});
  let store = null;
  const token = () => {

    // Try to get the token from localStorage. If it isn't here, it may
    // be passed as a cookie.

    // NOTE: THIS IS ONLY EVER EVALUATED ONCE, IN ORDER TO SEND A DIFFERNT
    // TOKEN YOU MUST DISCONNECT AND RECONNECT THE WEBSOCKET CLIENT.
    return getAuthToken(store);
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
  const context = {
    client,
    pym,
    plugins,
    eventEmitter,
    rest,
    graphqlRegistry,
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
