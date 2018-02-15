import React from 'react';
import { render } from 'react-dom';

import { createContext } from 'coral-framework/services/bootstrap';
import Main from './containers/Main';
import TalkProvider from 'coral-framework/components/TalkProvider';
import pluginsConfig from 'pluginsConfig';

async function main() {
  const context = await createContext({
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
