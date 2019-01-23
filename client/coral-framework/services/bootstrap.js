import { getStaticConfiguration } from 'coral-framework/services/staticConfiguration';
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
import { createPostMessage } from './postMessage';
import globalFragments from 'coral-framework/graphql/fragments';
import {
  createStorage,
  createPymStorage,
} from 'coral-framework/services/storage';
import { createHistory } from 'coral-framework/services/history';
import { createIntrospection } from 'coral-framework/services/introspection';
import { setStorageAuthToken } from 'coral-framework/services/auth';
import introspectionData from 'coral-framework/graphql/introspection.json';
import coreReducers from '../reducers';
import { checkLogin as checkLoginAction } from '../actions/auth';
import {
  mergeConfig,
  enablePluginsDebug,
  disablePluginsDebug,
} from '../actions/config';
import { setAuthToken, logout } from '../actions/auth';

/**
 * getAuthToken returns the active auth token or null
 *   Note: this method does not have access to the cookie based token used by
 *   browsers that don't allow us to use cross domain iframe local storage.
 * @return {string|null}
 */
const getAuthToken = (store, storage) => {
  let state = store.getState();

  if (state.config && state.config.auth_token) {
    // If the embed is called with `embed.login(token)`, and the browser is not
    // capable of storing the token in localStorage, then we would have
    // persisted it to the redux state.
    return state.config.auth_token || state.auth.token;
  } else if (location.hash && location.hash.startsWith('#access_token=')) {
    // Check to see if the access token is living in the URL as a hash.
    const token = location.hash.substring(14);

    history.replaceState(
      {},
      document.title,
      window.location.pathname + window.location.search
    );

    // Once we clear the hash above, this login method will not persist across
    // refreshes. We will need to persist the token to storage if it's
    // available.
    if (storage) {
      setStorageAuthToken(storage, token);
    }

    return token;
  } else if (
    !bowser.safari &&
    !bowser.ios &&
    storage &&
    storage.getItem('token')
  ) {
    // Use local storage auth tokens where there's a stable api.
    return storage.getItem('token');
  }

  return null;
};

function areWeInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function initExternalConfig({ store, pym, inIframe }) {
  if (!inIframe) {
    return;
  }
  return new Promise(resolve => {
    pym.sendMessage('getConfig');
    pym.onMessage('config', rawConfig => {
      const config = JSON.parse(rawConfig);
      if (config.plugin_config) {
        // @Deprecated
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            'Deprecation Warning: `config.plugin_config` will be phased out soon, please replace `config.plugin_config  with `config.plugins_config`'
          );
        }
        config.plugins_config = config.plugin_config;
        delete config.plugin_config;
      }
      store.dispatch(mergeConfig(config));
      resolve();
    });
  });
}

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
  checkLogin = true,
  addExternalConfig = true,
} = {}) {
  const inIframe = areWeInIframe();
  const eventEmitter = new EventEmitter({ wildcard: true });
  const localStorage = createStorage('localStorage');
  const sessionStorage = createStorage('sessionStorage');
  const pymLocalStorage = inIframe
    ? createPymStorage(pym, 'localStorage')
    : localStorage;
  const pymSessionStorage = inIframe
    ? createPymStorage(pym, 'sessionStorage')
    : sessionStorage;
  const history = createHistory(BASE_PATH);
  const introspection = createIntrospection(introspectionData);
  let store = null;
  const token = () => {
    // Try to get the token from localStorage. If it isn't here, it may
    // be passed as a cookie.

    // NOTE: THIS IS ONLY EVER EVALUATED ONCE, IN ORDER TO SEND A DIFFERENT
    // TOKEN YOU MUST DISCONNECT AND RECONNECT THE WEBSOCKET CLIENT.
    return getAuthToken(store, localStorage);
  };

  const rest = createRestClient({
    uri: `${BASE_PATH}api/v1`,
    token,
  });

  const staticConfig = getStaticConfiguration();
  let { LIVE_URI: liveUri, BASE_ORIGIN: origin } = staticConfig;
  if (liveUri == null) {
    // The protocol must match the origin protocol, secure/insecure.
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws';

    // Compose the live url from this protocol, the current host + base path
    // with the live path appended to it.
    liveUri = `${protocol}://${location.host}${BASE_PATH}api/v1/live`;
  }

  const postMessage = createPostMessage(origin);

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
    localStorage,
    sessionStorage,
    history,
    introspection,
    pymLocalStorage,
    pymSessionStorage,
    inIframe,
    postMessage,
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
    ...coreReducers,
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

  if (inIframe) {
    pym.onMessage('login', token => {
      if (token) {
        store.dispatch(setAuthToken(token));
      }
    });

    pym.onMessage('logout', () => {
      store.dispatch(logout());
    });

    pym.onMessage('enablePluginsDebug', () => {
      store.dispatch(enablePluginsDebug());
    });

    pym.onMessage('disablePluginsDebug', () => {
      store.dispatch(disablePluginsDebug());
    });
  }

  const preInitList = [];

  store.dispatch(
    mergeConfig({
      static: staticConfig,
    })
  );

  if (preInit) {
    preInitList.push(preInit(context));
  }

  if (addExternalConfig) {
    preInitList.push(initExternalConfig(context));
  }

  // Run pre initialization.
  await Promise.all(preInitList);

  if (checkLogin) {
    store.dispatch(checkLoginAction());
  }

  // Run initialization.
  await Promise.all([init(context), plugins.executeInit(context)]);
  return context;
}
