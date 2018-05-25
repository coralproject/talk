import React from 'react';
import { render } from 'react-dom';
import Embed from './containers/Embed';

import graphqlExtension from './graphql';
import { createContext } from 'coral-framework/services/bootstrap';
import reducers from './reducers';
import TalkProvider from 'coral-framework/components/TalkProvider';
import pluginsConfig from 'pluginsConfig';

// Resolves touch handling issues encountered on IOS Safari under certain
// circumstances. It may be related to issues reported here:
//
//  https://stackoverflow.com/questions/12363742/touchstart-event-is-not-firing-inside-iframe-ios-6
//
// Further details: https://www.pivotaltracker.com/story/show/157794038
document.body.addEventListener('touchstart', () => {});

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
