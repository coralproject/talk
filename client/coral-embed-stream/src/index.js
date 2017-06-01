import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {client} from 'coral-framework/services/client';
import {checkLogin} from 'coral-framework/actions/auth';
import './graphql';
import {addExternalConfig} from 'coral-embed-stream/src/actions/config';

import reducers from './reducers';
import {getStore, injectReducers} from 'coral-framework/services/store';
import AppRouter from './AppRouter';
import {pym} from 'coral-framework';
import {loadPluginsTranslations} from 'coral-framework/helpers/plugins';

const store = getStore();

loadPluginsTranslations();
injectReducers(reducers);

// Don't run this in the popup.
if (!window.opener) {
  store.dispatch(checkLogin());

  pym.sendMessage('getConfig');

  pym.onMessage('config', (config) => {
    store.dispatch(addExternalConfig(JSON.parse(config)));
  });
}

render(
  <ApolloProvider client={client} store={store}>
    <AppRouter />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
