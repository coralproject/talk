const redis = require('./redis');
const debug = require('debug')('talk:services:cache');

const cache = (module.exports = {});

/**
 * This collects a key that may either be an array or a string and creates a
 * unified key out of it.
 * @param  {Mixed} key Either an array of items composing a key or a string
 * @return {String}    A string that represents a key
 */
const keyfunc = key => {
  if (Array.isArray(key)) {
    return `cache[${key.join(':')}]`;
  }

  return `cache[${key}]`;
};

/**
 * This wraps a complicated function with a cache, in the event that the item is
 * not inside the cache, it will perform the work to get it and then set it
 * followed by returning the value.
 * @param  {Mixed} key       Either an array of items or string representing this
 *                           work
 * @param  {Integer} expiry  Time in seconds for the cache entry to live for
 * @param  {Function} work   A function that returns a promise that can be
 *                           resolved as the value to cache.
 * @return {Promise}         Resolves to the value either retrieved from cache
 */
cache.wrap = async (key, expiry, work, kf = keyfunc) => {
  let value = await cache.get(key, kf);
  if (typeof value !== 'undefined' && value !== null) {
    debug('wrap: hit', kf(key));
    return value;
  }

  debug('wrap: miss', kf(key));

  value = await work();

  process.nextTick(async () => {
    try {
      await cache.set(key, value, expiry, kf);
      debug('wrap: set complete');
    } catch (err) {
      console.error(err);
    }
  });

  return value;
};

/**
 * Init sets up the scripts used in Redis with the incr/decr commands.
 */
cache.init = async () => {
  // Create the redis instance.
  cache.client = redis.createClient();

  // This is designed to increment a key and add an expiry iff the key already
  // exists.
  cache.client.defineCommand('increx', {
    numberOfKeys: 1,
    lua: `
    if redis.call('GET', KEYS[1]) ~= false then
      redis.call('INCR', KEYS[1])
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    `,
  });

  // This is designed to decrement a key and add an expiry iff the key already
  // exists.
  cache.client.defineCommand('decrex', {
    numberOfKeys: 1,
    lua: `
    if redis.call('GET', KEYS[1]) ~= false then
      redis.call('DECR', KEYS[1])
      redis.call('EXPIRE', KEYS[1], ARGV[1])
    end
    `,
  });

  cache.client.defineCommand('hincrbyex', {
    numberOfKeys: 2,
    lua: `
    if redis.call('HGET', KEYS[1], KEYS[2]) ~= false then
      redis.call('HINCRBY', KEYS[1], KEYS[2], ARGV[1])
      redis.call('EXPIRE', KEYS[1], ARGV[2])
    end
    `,
  });
};

/**
 * This will increment a key in redis and update the expiry iff it already
 * exists, otherwise it will do nothing.
 */
cache.incr = async (key, expiry, kf = keyfunc) =>
  cache.client.increx(kf(key), expiry);

/**
 * This will decrement a key in redis and update the expiry iff it already
 * exists, otherwise it will do nothing.
 */
cache.decr = async (key, expiry, kf = keyfunc) =>
  cache.client.decrex(kf(key, expiry));

/**
 * This will increment many keys in redis and update the expiry iff it already
 * exists, otherwise it will do nothing.
 */
cache.incrMany = async (keys, expiry, kf = keyfunc) => {
  let multi = cache.client.multi();

  for (const key of keys) {
    // Queue up the evalsha command.
    multi.increx(kf(key), expiry);
  }

  return multi.exec();
};

/**
 * This will decrement many keys in redis and update the expiry iff it already
 * exists, otherwise it will do nothing.
 */
cache.decrMany = async (keys, expiry, kf = keyfunc) => {
  let multi = cache.client.multi();

  for (const key of keys) {
    // Queue up the evalsha command.
    multi.decrex(kf(key), expiry);
  }

  return multi.exec();
};

/**
 * [wrapMany description]
 * @param  {Array<String>} keys         Either an array of objects represening
 *                                      this work
 * @param  {Integer}       expiry       Time in seconds for the cache entry to live for
 * @param  {Function}      work         A function that returns a promise that can be
 *                                      resolved as the value to cache.
 * @param  {Function}      [kf=keyfunc] optional key function to use to turn the
 *                                      provided key into a string for the cache.
 * @return {Promise}                    resovles to the values for the keys
 */
cache.wrapMany = async (keys, expiry, work, kf = keyfunc) => {
  let values = await cache.getMany(keys, kf);

  // find any of the null valued items by collecting the work
  let workRefs = values
    .map((value, index) => ({ value, index, key: keys[index] }))
    .filter(({ value }) => value === null);

  let workKeys = workRefs.map(({ key }) => key);

  debug(`wrapMany: hit ratio: ${keys.length - workKeys.length}/${keys.length}`);

  if (workKeys.length > 0) {
    const workedValues = await work(workKeys);

    // Set the items in the cache that we needed to retrive after the
    // next process tick.
    process.nextTick(() => {
      cache
        .setMany(workKeys, workedValues, expiry, kf)
        .then(() => {
          debug('wrapMany: setMany complete');
        })
        .catch(err => {
          console.error(err);
        });
    });

    // Walk over the worked keys to merge them with the existing values.
    for (let i = 0; i < workRefs.length; i++) {
      values[workRefs[i].index] = workedValues[i];
    }
  }

  return values;
};

/**
 * This returns a promise that returns a promise that resolves with the value
 * from the cache or null if it does not exist in the cache.
 * @param  {Mixed} key Either an array of items composing a key or a string
 * @return {Promise}
 */
cache.get = async (key, kf = keyfunc) =>
  cache.client.get(kf(key)).then(reply => {
    if (typeof reply !== 'undefined' && reply !== null) {
      // Parse the stored cache value from JSON.
      return JSON.parse(reply);
    }

    return null;
  });

/**
 * Returns many replies.
 * @param  {Array<String>} keys         Either an array of objects represening
 *                                      this work
 * @param  {Function}      [kf=keyfunc] optional key function to use to turn the
 *                                      provided key into a string for the cache.
 */
cache.getMany = async (keys, kf = keyfunc) =>
  cache.client.mget(keys.map(kf)).then(replies => {
    // Parse the replies.
    for (let i = 0; i < replies.length; i++) {
      let value = null;

      if (typeof replies[i] !== 'undefined' && replies[i] !== null) {
        // Parse the stored cache value from JSON.
        value = JSON.parse(replies[i]);
      }

      replies[i] = value;
    }

    return replies;
  });

/**
 * Sets many entries in the cache.
 * @param  {Array<String>} keys         array of keys
 * @param  {Array}         values       array of values to set
 * @param  {Function}      [kf=keyfunc] optional key function to use to turn the
 *                                      provided key into a string for the cache.
 */
cache.setMany = async (keys, values, expiry, kf = keyfunc) => {
  let multi = cache.client.multi();

  keys.forEach((key, index) => {
    // Serialize the value as JSON.
    let reply = JSON.stringify(values[index]);

    // Queue up the set command.
    multi.set(kf(key), reply, 'EX', expiry);
  });

  return multi.exec();
};

/**
 * This invalidates a cached entry in the cache.
 * @param  {Mixed} key Either an array of items composing a key or a string
 * @return {Promise}
 */
cache.invalidate = async (key, kf = keyfunc) => {
  debug(`invalidate: ${kf(key)}`);

  return cache.client.del(kf(key));
};

/**
 * This sets a value on the key with the expiry and then resolves once it is
 * done.
 * @param  {Mixed}   key     Either an array of items composing a key or a string
 * @param  {Mixed}   value   Object to be serialized and set to the cache
 * @param  {Integer} expiry  Time in seconds for the cache entry to live for
 * @return {Promise}
 */
cache.set = async (key, value, expiry, kf = keyfunc) => {
  // Serialize the value as JSON.
  let reply = JSON.stringify(value);

  return cache.client.set(kf(key), reply, 'EX', expiry);
};
