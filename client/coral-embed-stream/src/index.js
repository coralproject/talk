import React from 'react';
import {render} from 'react-dom';

import {checkLogin, handleAuthToken, logout} from 'coral-embed-stream/src/actions/auth';
import './graphql';
import {addExternalConfig} from 'coral-embed-stream/src/actions/config';
import {createContext} from 'coral-framework/services/bootstrap';
import AppRouter from './AppRouter';
import reducers from './reducers';
import TalkProvider from 'coral-framework/components/TalkProvider';
import plugins from 'pluginsConfig';

const context = createContext(reducers, plugins);

// TODO: move init code into `bootstrap` service after auth has been refactored.
const {store, pym} = context;

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
}

render(
  <TalkProvider
    {...context}
  >
    <AppRouter />
  </TalkProvider>
  , document.querySelector('#talk-embed-stream-container')
);
