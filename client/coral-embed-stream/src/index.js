import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {client} from 'coral-framework/client';
import store from 'coral-framework/store';

import Stream from './CommentStream';

render(
  <ApolloProvider client={client} store={store}>
    <Stream />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
