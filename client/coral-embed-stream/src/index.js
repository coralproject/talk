import React from 'react';
import {render} from 'react-dom';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';
import thunk from 'redux-thunk';
import {createStore, applyMiddleware, compose} from 'redux';

import Stream from './CommentStream';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: '/api/v1/graph/ql',
    opts: {
      credentials: 'same-origin'
    }
  })
});

const store = createStore(
  client.reducer(),
  {}, // initial state
  compose(
      applyMiddleware(thunk),
      window.devToolsExtension ? window.devToolsExtension() : f => f,
  )
);

render(
    <ApolloProvider client={client} store={store}>
      <Stream />
    </ApolloProvider>

    , document.querySelector('#coralStream'));
