import React from 'react';
import {render} from 'react-dom';
import {ApolloProvider} from 'react-apollo';

import {checkLogin} from 'coral-framework/actions/auth';
import './graphql';
import {addExternalConfig} from 'coral-embed-stream/src/actions/config';
import {getStore, injectReducers, addListener} from 'coral-framework/services/store';
import {getClient} from 'coral-framework/services/client';
import pym from 'coral-framework/services/pym';
import AppRouter from './AppRouter';
import {loadPluginsTranslations, injectPluginsReducers} from 'coral-framework/helpers/plugins';
import reducers from './reducers';
import EventEmitter from 'eventemitter2';
import EventEmitterProvider from 'coral-framework/components/EventEmitterProvider';

const store = getStore();
const client = getClient();
const eventEmitter = new EventEmitter({wildcard: true});

loadPluginsTranslations();
injectPluginsReducers();
injectReducers(reducers);

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

function init(config = {}) {
  store.dispatch(addExternalConfig(config));
  store.dispatch(checkLogin());
}

// Don't run this in the popup.
if (!window.opener) {
  if (inIframe()) {
    pym.sendMessage('getConfig');
    pym.onMessage('config', (config) => {
      init(JSON.parse(config));
    });
  } else {
    init();
  }

  // Pass any events through our parent.
  eventEmitter.onAny((eventName, value) => {
    pym.sendMessage('event', JSON.stringify({eventName, value}));
  });

  // Add a redux listener to pass through all actions to our event emitter.
  addListener((action) => {

    // Handle apollo actions.
    if (action.type.startsWith('APOLLO_')) {
      if (action.type === 'APOLLO_SUBSCRIPTION_RESULT') {
        const {operationName, variables, result: {data}} = action;
        eventEmitter.emit(`subscription.${operationName}.data`, {variables, data});
      }
      return;
    }
    eventEmitter.emit(`action.${action.type}`, {action});
  });
}

render(
  <EventEmitterProvider eventEmitter={eventEmitter}>
    <ApolloProvider client={client} store={store}>
      <AppRouter />
    </ApolloProvider>
  </EventEmitterProvider>
  , document.querySelector('#talk-embed-stream-container')
);
