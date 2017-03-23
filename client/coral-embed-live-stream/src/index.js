import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {client} from 'coral-framework/services/client';

// import store from 'coral-framework/services/store';

import Embed from './Embed';

render(
  <ApolloProvider client={client}>
    <Embed assetID='8377903e-2601-47d9-af8a-1baab5651da9' />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
