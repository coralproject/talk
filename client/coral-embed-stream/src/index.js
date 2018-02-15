import React from 'react';
import { render } from 'react-dom';
import Embed from './containers/Embed';

import graphqlExtension from './graphql';
import { createContext } from 'coral-framework/services/bootstrap';
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
      <Embed />
    </TalkProvider>,
    document.querySelector('#talk-embed-stream-container')
  );
}

main();
