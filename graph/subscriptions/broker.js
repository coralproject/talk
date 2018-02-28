const { EventEmitter2 } = require('eventemitter2');
const debug = require('debug')('talk:graph:subscriptions:broker');
const { getPubsub } = require('./pubsub');

/**
 * Broker acts as a pubsub client adapter. Any calls to publish will push into
 * the PubSub client and the local event emitter.
 */
class Broker extends EventEmitter2 {
  constructor(pubsub) {
    // Create the underlying event emitter.
    super({
      wildcard: true, // Allow wildcard listeners.
      maxListeners: 0, // Disable maximum for listeners.
    });

    this.pubsub = pubsub;
  }

  /**
   * Publishes the event out to the pubsub system and to the broker.
   *
   * @param {String} event the name of the event to publish
   * @param {Any} args the
   */
  publish(event, ...args) {
    debug(`publish:${event}`);
    this.pubsub.publish(event, ...args);
    this.emit(event, ...args);
  }
}

let client = null;
const getBroker = () => {
  if (client !== null) {
    return client;
  }

  // Create the new Broker to manage events being published out to
  // the pubsub so that we may intercept.
  client = new Broker(getPubsub());

  debug('created');

  return client;
};

module.exports.getBroker = getBroker;
