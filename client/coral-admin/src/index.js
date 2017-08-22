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

smoothscroll.polyfill();

const notification = createNotificationService(toast);
const context = createContext({reducers, graphqlExtension, pluginsConfig, notification});

render(
  <TalkProvider {...context}>
    <App />
  </TalkProvider>
  , document.querySelector('#root')
);
