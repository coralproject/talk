const { EventEmitter2 } = require('eventemitter2');
const constants = require('./constants');
const debug = require('debug')('talk:services:events');
const enabled = require('debug').enabled('talk:services:events');

const emitter = new EventEmitter2({
  wildcard: true,
});

// If event debugging is enabled, bind the debugger to all events being emitted
// and log a debug message.
if (enabled) {
  emitter.onAny(function(event) {
    debug(
      `[${event}] ${arguments.length - 1} argument${
        arguments.length - 1 === 1 ? '' : 's'
      }`
    );
  });
}

// Allow any number of listeners to attach to this.
emitter.setMaxListeners(0);

// The default error handler.
emitter.on('error', err => {
  console.error('events error:', err);
});

emitter.on('newListener', event => {
  if (!(event in constants)) {
    throw new Error(`Event[${event}] not a valid event name`);
  }
});

module.exports = emitter;
