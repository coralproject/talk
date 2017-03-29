import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {client} from 'coral-framework/services/client';

// import store from 'coral-framework/services/store';

import Embed from './Embed';

render(
  <ApolloProvider client={client}>
    <Embed assetID='7babeab7-4546-4b2d-a0cd-841bd4e32c05' />
  </ApolloProvider>
  , document.querySelector('#coralStream')
);
