import React from 'react';
import { render } from 'react-dom';

import {
  checkLogin,
  handleAuthToken,
  logout,
} from 'coral-embed-stream/src/actions/auth';
import graphqlExtension from './graphql';
import { addExternalConfig } from 'coral-embed-stream/src/actions/config';
import { createContext } from 'coral-framework/services/bootstrap';
import AppRouter from './AppRouter';
import reducers from './reducers';
import TalkProvider from 'coral-framework/components/TalkProvider';
import pluginsConfig from 'pluginsConfig';

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

// TODO: move init code into `bootstrap` service after auth has been refactored.
function preInit({ store, pym }) {
  // TODO: This is popup specific code and needs to be refactored.
  if (!inIframe()) {
    store.dispatch(addExternalConfig({}));
    store.dispatch(checkLogin());
    return;
  }

  pym.onMessage('login', token => {
    if (token) {
      store.dispatch(handleAuthToken(token));
    }
    store.dispatch(checkLogin());
  });

  pym.onMessage('logout', () => {
    store.dispatch(logout());
  });

  return new Promise(resolve => {
    pym.sendMessage('getConfig');
    pym.onMessage('config', config => {
      store.dispatch(addExternalConfig(JSON.parse(config)));
      store.dispatch(checkLogin());
      resolve();
    });
  });
}

async function main() {
  const context = await createContext({
    reducers,
    graphqlExtension,
    pluginsConfig,
    preInit,
  });
  render(
    <TalkProvider {...context}>
      <AppRouter />
    </TalkProvider>,
    document.querySelector('#talk-embed-stream-container')
  );
}

main();
