import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {client} from 'coral-framework/services/client';
import {checkLogin} from 'coral-framework/actions/auth';
import './graphql';

import reducers from './reducers';
import localStore, {injectReducers} from 'coral-framework/services/store';
import AppRouter from './AppRouter';

injectReducers(reducers);

const store = (window.opener && window.opener.coralStore) ? window.opener.coralStore : localStore;

// Don't run this in the popup.
if (store === localStore) {
  store.dispatch(checkLogin());
}

render(
  <ApolloProvider client={client} store={store}>
    <AppRouter />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
