import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {client} from 'coral-framework/services/client';
import {store, injectReducers} from 'coral-framework/services/store';

import Embed from './containers/Embed';
import reducers from './reducers';

injectReducers(reducers);

render(
  <ApolloProvider client={client} store={store}>
    <Embed />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
