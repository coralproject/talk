import React from 'react';
import { render } from 'react-dom';

import graphqlExtension from './graphql';
import { createContext } from 'coral-framework/services/bootstrap';
import AppRouter from './AppRouter';
import reducers from './reducers';
import TalkProvider from 'coral-framework/components/TalkProvider';
import pluginsConfig from 'pluginsConfig';

async function main() {
  const context = await createContext({
    reducers,
    graphqlExtension,
    pluginsConfig,
  });
  render(
    <TalkProvider {...context}>
      <AppRouter />
    </TalkProvider>,
    document.querySelector('#talk-embed-stream-container')
  );
}

main();
