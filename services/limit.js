const ms = require('ms');
const errors = require('../errors');
const {createClientFactory} = require('./redis');
const client = createClientFactory();

class Limit {
  constructor(prefix, max, duration) {
    this.ttl = ms(duration) / 1000;
    this.prefix = prefix;
    this.max = max;
  }

  key(value) {
    return `limit[${this.prefix}][${value}]`;
  }

  async get(value) {
    const key = this.key(value);

    return client().get(key);
  }

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
