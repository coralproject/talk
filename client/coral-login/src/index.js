import React from 'react';
import { render } from 'react-dom';

import { createContext } from 'coral-framework/services/bootstrap';
import Main from './containers/Main';
import reducers from './reducers';
import TalkProvider from 'coral-framework/components/TalkProvider';
import pluginsConfig from 'pluginsConfig';

async function main() {
  const context = await createContext({
    reducers,
    pluginsConfig,
  });
  render(
    <TalkProvider {...context}>
      <Main />
    </TalkProvider>,
    document.querySelector('#talk-login-container')
  );
}

main();
