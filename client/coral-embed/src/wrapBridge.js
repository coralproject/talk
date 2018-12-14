export default bridge => {
  // whenRendered will call the callback when the stream has rendered (or now if
  // the stream is already rendered).
  const whenRendered = callback => bridge.queueWhenRendered(callback);

  // onlyWhenRendered will guard the callback unless the stream is rendered.
  const onlyWhenRendered = callback => {
    bridge.ensureRendered();
    callback();
  };

  // Return the limited stream interface.
  return {
    // Directly map the on/off from the event emitter to the stream.
    on: (eventName, callback) => bridge.emitter.on(eventName, callback),
    off: (eventName, callback) => bridge.emitter.off(eventName, callback),

    // Queue up the login operation until the stream has been rendered.
    login: token => whenRendered(() => bridge.login(token)),

    // Queue up the logout operation until the stream has been rendered.
    logout: () => whenRendered(() => bridge.logout()),

    // Remove the stream if it's already been rendered.
    remove: () => onlyWhenRendered(() => bridge.remove()),

    // Queue up the plugin config until the embed has rendered.
    enablePluginsDebug: () => whenRendered(() => bridge.enablePluginsDebug()),
    disablePluginsDebug: () => whenRendered(() => bridge.disablePluginsDebug()),
  };
};
