import React from 'react';
import { render } from 'react-dom';
import smoothscroll from 'smoothscroll-polyfill';
import TalkProvider from 'coral-framework/components/TalkProvider';
import { createContext } from 'coral-framework/services/bootstrap';
import reducers from './reducers';
import App from './components/App';
import 'react-mdl/extra/material.js';
import graphqlExtension from './graphql';
import pluginsConfig from 'pluginsConfig';
import { toast } from 'react-toastify';
import { createNotificationService } from './services/notification';
import { hideShortcutsNote } from './actions/moderation';

smoothscroll.polyfill();

function init({ store, storage }) {
  if (storage && storage.getItem('coral:shortcutsNote') === 'hide') {
    store.dispatch(hideShortcutsNote());
  }
}

async function main() {
  const notification = createNotificationService(toast);
  const context = await createContext({
    reducers,
    graphqlExtension,
    pluginsConfig,
    notification,
    init,
  });

  render(
    <TalkProvider {...context}>
      <App />
    </TalkProvider>,
    document.querySelector('#root')
  );
}

main();
