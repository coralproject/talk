import {createStore} from './store';
import {createClient, apolloErrorReporter} from './client';
import pym from './pym';
import EventEmitter from 'eventemitter2';
import {createReduxEmitter} from './events';
import {createRestClient} from './rest';
import thunk from 'redux-thunk';
import {loadTranslations} from './i18n';
import {getTranslations, getReducers} from '../helpers/plugins';
import bowser from 'bowser';
import * as Storage from '../helpers/storage';
import {BASE_PATH} from 'coral-framework/constants/url';

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

export function createContext(reducers, plugins) {
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
  const context = {
    client,
    pym,
    plugins,
    eventEmitter,
    rest,
  };

  // Load plugin translations.
  getTranslations(plugins).forEach((t) => loadTranslations(t));

  // Pass any events through our parent.
  eventEmitter.onAny((eventName, value) => {
    pym.sendMessage('event', JSON.stringify({eventName, value}));
  });

  const finalReducers = {
    ...reducers,
    ...getReducers(plugins),
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
