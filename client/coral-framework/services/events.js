/**
 * createReduxEmitter returns a redux middleware proxying redux actions to
 * the event emitter
 * @param  {Object}    eventEmitter
 * @return {function}  redux middleware
 */
export function createReduxEmitter(eventEmitter) {
  return () => next => action => {
    // Handle apollo actions.
    if (action.type.startsWith('APOLLO_')) {
      if (action.type === 'APOLLO_SUBSCRIPTION_RESULT') {
        const { operationName, variables, result: { data } } = action;
        eventEmitter.emit(`subscription.${operationName}.data`, {
          variables,
          data,
        });
      }
      return next(action);
    }
    eventEmitter.emit(`action.${action.type}`, { action });

    return next(action);
  };
}
