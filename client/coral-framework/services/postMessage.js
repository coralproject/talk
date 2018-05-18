import set from 'lodash/set';
import has from 'lodash/has';
import get from 'lodash/get';
import remove from 'lodash/remove';

/**
 * createPostMessage returns a service that deals with cross
 * window communication using the postMessage API.
 * @param  {string}  origin
 * @param  {string}  scope
 * @return {Object}  postMessage service
 */
export function createPostMessage(origin, scope = 'client') {
  // Store a reference to each listener added.
  const listeners = {};

  // withOriginCheck wraps a given handler for a messages event with a check to
  // see if the origin matches.
  const withOriginCheck = handler => {
    return event => {
      if (get(event, 'origin') !== origin) {
        return;
      }

      if (get(event, 'data.scope') !== scope) {
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

  return {
    post(name, data, target = window.opener) {
      if (!target) {
        return;
      }

      // Serialize the message to be sent via postMessage.
      const msg = { name, data, scope };

      // Send the message.
      target.postMessage(msg, origin);
    },
    subscribe(handler, target = window) {
      // If this handler is already attached to the target, detach it.
      if (has(listeners, [target, handler])) {
        this.unsubscribe(handler, target);
      }

      // Wrap the listener with a origin check.
      const listener = withOriginCheck(withParseData(handler));

      // Save a reference to the compiled listener.
      set(listeners, [target, handler], listener);

      // Attach the listener to the target.
      target.addEventListener('message', listener);
    },
    unsubscribe(handler, target = window) {
      if (!has(listeners, [target, handler])) {
        return;
      }

      const listener = get(listeners, [target, handler]);

      // Remove the listener from the target.
      target.removeEventListener('message', listener);

      remove(listeners, [target, handler]);
    },
  };
}
