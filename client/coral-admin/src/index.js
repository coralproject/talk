import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';
import smoothscroll from 'smoothscroll-polyfill';
import EventEmitter from 'eventemitter2';
import EventEmitterProvider from 'coral-framework/components/EventEmitterProvider';

import {getClient} from 'coral-framework/services/client';
import store from './services/store';

import App from './components/App';

import 'react-mdl/extra/material.js';
import './graphql';
import {loadPluginsTranslations, injectPluginsReducers} from 'coral-framework/helpers/plugins';

const eventEmitter = new EventEmitter();

// TODO: pass redux actions through the emitter.

loadPluginsTranslations();
injectPluginsReducers();
smoothscroll.polyfill();

render(
  <EventEmitterProvider eventEmitter={eventEmitter}>
    <ApolloProvider client={getClient()} store={store}>
      <App />
    </ApolloProvider>
  </EventEmitterProvider>
  , document.querySelector('#root')
);
