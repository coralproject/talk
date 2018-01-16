const ms = require('ms');
const errors = require('../errors');
const { createClientFactory } = require('./redis');
const client = createClientFactory();

/**
 * Limit is designed to support rate limiting a resource.
 */
class Limit {
  constructor(prefix, max, duration) {
    this.ttl = ms(duration) / 1000;
    this.prefix = prefix;
    this.max = max;
  }

  /**
   * key will compose the redis key used to store the rate limit information.
   *
   * @param {String} value the string to use that is being limited
   * @returns {String} the redis key to set
   */
  key(value) {
    return `limit[${this.prefix}][${value}]`;
  }

  /**
   * get will fetch the current number of attempts within the given window
   * duration.
   *
   * @param {String} value the value to limit with
   * @returns {Integer} the number of tries within the current window
   */
  async get(value) {
    const key = this.key(value);

    return client().get(key);
  }

  /**
   * test will increment the number of tries, reset the window length and
   * will throw an error if the number of tries exceed the maximum for the
   * window duration.
   *
   * @param {String} value the value to limit with
   * @returns {Promise} resolves to the number of tries, or throws an error
   */
  async test(value) {
    const key = this.key(value);

    const [[, tries], [, expiry]] = await client()
      .multi()
      .incr(key)
      .expire(key, this.ttl)
      .exec();

    // if this is new or has no expiry
    if (tries === 1 || expiry === -1) {
      // then expire it after the timeout
      client().expire(key, this.ttl);
    }

    if (tries > this.max) {
      throw errors.ErrMaxRateLimit;
    }

    return tries;
  }
}

module.exports = Limit;
