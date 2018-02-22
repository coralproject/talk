import { SCOPE, ORIGIN } from './constants';

import set from 'lodash/set';
import has from 'lodash/has';
import get from 'lodash/get';
import remove from 'lodash/remove';

// withOriginCheck wraps a given handler for a messages event with a check to
// see if the origin matches.
const withOriginCheck = handler => {
  return event => {
    const origin = get(event, 'origin');
    if (origin !== ORIGIN) {
      return;
    }

    const scope = get(event, 'data.scope');
    if (scope !== SCOPE) {
      return;
    }

    // Pass the handler the event details.
    handler(event);
  };
};

// withParseData will parse the data.
const withParseData = handler => {
  return event => {
    const data = get(event, 'data.data');
    const name = get(event, 'data.name');
    if (!data || !name) {
      return;
    }

    handler({ data, name, event });
  };
};

// Store a reference to each listener added.
const listeners = {};

export const subscribeToMessages = (handler, target = window) => {
  // If this handler is already attached to the target, detach it.
  if (has(listeners, [target, handler])) {
    unsubscribeFromMessages(handler, target);
  }

  // Wrap the listener with a origin check.
  const listener = withOriginCheck(withParseData(handler));

  // Save a reference to the compiled listener.
  set(listeners, [target, handler], listener);

  // Attach the listener to the target.
  target.addEventListener('message', listener);
};

export const unsubscribeFromMessages = (handler, target = window) => {
  if (!has(listeners, [target, handler])) {
    return;
  }

  const listener = get(listeners, [target, handler]);

  // Remove the listener from the target.
  target.removeEventListener('message', listener);

  remove(listeners, [target, handler]);
};
