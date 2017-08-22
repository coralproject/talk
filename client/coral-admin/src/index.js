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

const context = createContext({reducers, graphqlExtension, pluginsConfig});

smoothscroll.polyfill();

render(
  <TalkProvider
    {...context}
  >
    <App />
  </TalkProvider>
  , document.querySelector('#root')
);
