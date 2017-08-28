const {EventEmitter2} = require('eventemitter2');
const debug = require('debug')('talk:services:events');
const enabled = require('debug').enabled('talk:services:events');

const events = new EventEmitter2({
  wildcard: true,
});

// If event debugging is enabled, bind the debugger to all events being emitted
// and log a debug message.
if (enabled) {
  events.onAny(function(event) {
    debug(`[${event}] ${arguments.length - 1} argument${arguments.length - 1 === 1 ? '' : 's'}`);
  });
}

// The default error handler.
events.on('error', (err) => {
  console.error('events error:', err);
});

module.exports = events;
