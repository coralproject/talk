import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {checkLogin} from 'coral-framework/actions/auth';
import './graphql';
import {addExternalConfig} from 'coral-embed-stream/src/actions/config';
import {getStore, injectReducers} from 'coral-framework/services/store';
import {getClient} from 'coral-framework/services/client';
import AppRouter from './AppRouter';
import {pym} from 'coral-framework';
import {loadPluginsTranslations, injectPluginsReducers} from 'coral-framework/helpers/plugins';
import reducers from './reducers';

const store = getStore();
const client = getClient();

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
  } else {
    init();
  }
}

render(
  <ApolloProvider client={client} store={store}>
    <AppRouter />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
