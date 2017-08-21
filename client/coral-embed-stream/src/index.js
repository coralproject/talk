import React from 'react';
import {render} from 'react-dom';

import {checkLogin, handleAuthToken, logout} from 'coral-embed-stream/src/actions/auth';
import './graphql';
import {addExternalConfig} from 'coral-embed-stream/src/actions/config';
import {getStore, injectReducers, addListener} from 'coral-framework/services/store';
import {getClient} from 'coral-framework/services/client';
import {createReduxEmitter} from 'coral-framework/services/events';
import pym from 'coral-framework/services/pym';
import AppRouter from './AppRouter';
import {loadPluginsTranslations, injectPluginsReducers} from 'coral-framework/helpers/plugins';
import reducers from './reducers';
import EventEmitter from 'eventemitter2';
import TalkProvider from 'coral-framework/components/TalkProvider';
import plugins from 'pluginsConfig';

const store = getStore();
const client = getClient();
const eventEmitter = new EventEmitter({wildcard: true});

loadPluginsTranslations();
injectPluginsReducers();
injectReducers(reducers);

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function init(config = {}) {
  store.dispatch(addExternalConfig(config));
  store.dispatch(checkLogin());
}

// Don't run this in the popup.
if (!window.opener) {
  if (inIframe()) {
    pym.sendMessage('getConfig');
    pym.onMessage('config', (config) => {
      init(JSON.parse(config));
    });

    pym.onMessage('login', (token) => {
      if (token) {
        store.dispatch(handleAuthToken(token));
      }
      store.dispatch(checkLogin());
    });

    pym.onMessage('logout', () => {
      store.dispatch(logout());
    });
  } else {
    init();
  }

  // Pass any events through our parent.
  eventEmitter.onAny((eventName, value) => {
    pym.sendMessage('event', JSON.stringify({eventName, value}));
  });

  // Add a redux listener to pass through all actions to our event emitter.
  addListener(createReduxEmitter(eventEmitter));
}

render(
  <TalkProvider
    eventEmitter={eventEmitter}
    client={client}
    store={store}
    pym={pym}
    plugins={plugins}
  >
    <AppRouter />
  </TalkProvider>
  , document.querySelector('#talk-embed-stream-container')
);
