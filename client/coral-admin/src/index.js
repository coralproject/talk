import React from 'react';
import {render} from 'react-dom';
import smoothscroll from 'smoothscroll-polyfill';
import TalkProvider from 'coral-framework/components/TalkProvider';
import {createContext} from 'coral-framework/services/bootstrap';
import reducers from './reducers';
import App from './components/App';
import 'react-mdl/extra/material.js';
import graphqlExtension from './graphql';
import pluginsConfig from 'pluginsConfig';
import {toast} from 'react-toastify';
import {createNotificationService} from './services/notification';
import {hideShortcutsNote} from './actions/moderation';

function hidrateStore({store, storage}) {
  if (storage && storage.getItem('coral:shortcutsNote') === 'hide') {
    store.dispatch(hideShortcutsNote());
  }
}

smoothscroll.polyfill();

const notification = createNotificationService(toast);
const context = createContext({reducers, graphqlExtension, pluginsConfig, notification});

// hidrate Store with external data.
hidrateStore(context);

render(
  <TalkProvider {...context}>
    <App />
  </TalkProvider>
  , document.querySelector('#root')
);
