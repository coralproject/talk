const redis = require('./redis');

const cache = module.exports = {};

/**
 * This collects a key that may either be an array or a string and creates a
 * unified key out of it.
 * @param  {Mixed} key Either an array of items composing a key or a string
 * @return {String}    A string that represents a key
 */
const keyfunc = (key) => {
  if (Array.isArray(key)) {
    return `cache[${key.join(':')}]`;
  }

  return `cache[${key}]`;
};

/**
 * This wraps a complicated function with a cache, in the event that the item is
 * not inside the cache, it will perform the work to get it and then set it
 * followed by returning the value.
 * @param  {Mixed} key       Either an array of items or string represening this
 *                           work
 * @param  {Integer} expiry  Time in seconds for the cache entry to live for
 * @param  {Function} work   A function that returns a promise that can be
 *                           resolved as the value to cache.
 * @return {Promise}         Resolves to the value either retrieved from cache
 */
cache.wrap = (key, expiry, work) => {
  return cache
    .get(key)
    .then((value) => {
      if (value !== null) {
        return value;
      }

      return work()
        .then((value) => {
          return cache
            .set(key, value, expiry)
            .then(() => value);
        });
    });
};

/**
 * This returns a promise that returns a promise that resolves with the value
 * from the cache or null if it does not exist in the cache.
 * @param  {Mixed} key Either an array of items composing a key or a string
 * @return {Promise}
 */
cache.get = (key) => new Promise((resolve, reject) => {
  redis.get(keyfunc(key), (err, reply) => {
    if (err) {
      return reject(err);
    }

    if (reply !== null) {
      let value;

      try {

        // Parse the stored cache value from JSON.
        value = JSON.parse(reply);
      } catch (e) {
        return reject(e);
      }

      return resolve(value);
    }

    resolve(null);
  });
});

/**
 * This sets a value on the key with the expiry and then resolves once it is
 * done.
 * @param  {Mixed} key   Either an array of items composing a key or a string
 * @param  {Mixed} value Object to be serialized and set to the cache
 * @param  {Integer} expiry  Time in seconds for the cache entry to live for
 * @return {Promise}
 */
cache.set = (key, value, expiry) => new Promise((resolve, reject) => {

  // Serialize the value as JSON.
  let reply = JSON.stringify(value);

  redis.set(keyfunc(key), reply, 'EX', expiry, (err) => {
    if (err) {
      return reject(err);
    }

    return resolve();
  });
});
