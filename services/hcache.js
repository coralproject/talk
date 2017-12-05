const cache = require('./cache');
const debug = require('debug')('talk:services:hcache');

const kf = (key) => `hcache:${key}`;

const hcache = module.exports = {};

hcache.get = async (key, field = '__default__') => {

  // Get the current value from redis.
  const reply = await cache.client.hget(kf(key), field);

  if (typeof reply !== 'undefined' && reply !== null) {
    return JSON.parse(reply);
  }

  return null;
};

hcache.set = async (key, field = '__default__', value, expiry = 60) => {

  // Serialize the value as JSON.
  let reply = JSON.stringify(value);

  return cache.client
    .pipeline()
    .hset(kf(key), field, reply)
    .expire(kf(key), expiry)
    .exec();
};

hcache.del = async (key, field = null) => {
  if (field === null) {
    return cache.client.del(kf(key));
  }

  return cache.client.hdel(kf(key), field);
};

hcache.wrap = async (key, field, expiry, work) => {
  let value = await hcache.get(key, field);
  if (value !== null) {
    debug('wrap: hit', kf(key));
    return value;
  }

  debug('wrap: miss', kf(key));

  value = await work();

  process.nextTick(async () => {
    try {
      await hcache.set(key, field, value, expiry);
      debug('wrap: set complete');
    } catch (err) {
      console.error(err);
    }
  });

  return value;
};
