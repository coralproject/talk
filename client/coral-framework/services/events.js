export function createReduxEmitter(eventEmitter) {
  return (action) => {

    // Handle apollo actions.
    if (action.type.startsWith('APOLLO_')) {
      if (action.type === 'APOLLO_SUBSCRIPTION_RESULT') {
        const {operationName, variables, result: {data}} = action;
        eventEmitter.emit(`subscription.${operationName}.data`, {variables, data});
      }
      return;
    }
    eventEmitter.emit(`action.${action.type}`, {action});
  };
}
