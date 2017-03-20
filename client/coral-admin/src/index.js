import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import { client } from './services/client';
import store from './services/store';

import App from './components/App';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

render(
  <ApolloProvider client={client} store={store}>
    <App />
  </ApolloProvider>
  , document.querySelector('#root')
);
