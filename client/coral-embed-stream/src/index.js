import React from 'react';
import {render} from 'react-dom';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import {ApolloProvider} from 'react-apollo';

import Stream from '../../coral-plugin-stream/Stream';

const client = new ApolloClient({
  networkInterface: createNetworkInterface({uri: '/api/v1/graph/ql'})
});

render(
    <ApolloProvider client={client}>
      <Stream />
    </ApolloProvider>

    , document.querySelector('#coralStream'));
