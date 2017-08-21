import React from 'react';
import {render} from 'react-dom';
import smoothscroll from 'smoothscroll-polyfill';
import EventEmitter from 'eventemitter2';
import TalkProvider from 'coral-framework/components/TalkProvider';

import {getClient} from 'coral-framework/services/client';
import store from './services/store';

import App from './components/App';

import 'react-mdl/extra/material.js';
import './graphql';
import {loadPluginsTranslations, injectPluginsReducers} from 'coral-framework/helpers/plugins';
import plugins from 'pluginsConfig';

const eventEmitter = new EventEmitter();
const client = getClient();

// TODO: pass redux actions through the emitter.

loadPluginsTranslations();
injectPluginsReducers();
smoothscroll.polyfill();

render(
  <TalkProvider
    eventEmitter={eventEmitter}
    client={client}
    store={store}
    plugins={plugins}
  >
    <App />
  </TalkProvider>
  , document.querySelector('#root')
);
