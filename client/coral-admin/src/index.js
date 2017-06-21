import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {getClient} from './services/client';
import store from './services/store';

import App from './components/App';

import 'react-mdl/extra/material.js';
import './graphql';
import {loadPluginsTranslations, injectPluginsReducers} from 'coral-framework/helpers/plugins';

loadPluginsTranslations();
injectPluginsReducers();

render(
  <ApolloProvider client={getClient()} store={store}>
    <App />
  </ApolloProvider>
  , document.querySelector('#root')
);
