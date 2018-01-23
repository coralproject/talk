const _ = require('lodash');
const DataLoader = require('dataloader');
const cache = require('../../services/cache');

/**
 * SingletonResolver is a cached loader for a single result.
 */
class SingletonResolver {
  constructor(resolver) {
    this._cache = null;
    this._resolver = resolver;
  }

  load() {
    if (this._cache) {
      return this._cache;
    }

    let promise = this._resolver(arguments).then(result => {
      return result;
    });

    // Set the promise on the cache.
    this._cache = promise;

    return promise;
  }
}

/**
 * This joins a set of results with a specific keys and sets an empty array in
 * place if it was not found.
 * @param  {Array}  ids ids to locate
 * @param  {String} key key to group by
 * @return {Array}      array of results
 */
const arrayJoinBy = (ids, key) => items => {
  const itemsByKey = _.groupBy(items, key);

  return ids.map(id => {
    if (id in itemsByKey) {
      return itemsByKey[id];
    }

    return [];
  });
};

/**
 * This joins a set of results with a specific keys and sets null in place if it
 * was not found.
 * @param  {Array}  ids ids to locate
 * @param  {String} key key to group by
 * @return {Array}      array of results
 */
const singleJoinBy = (ids, key) => items => {
  const itemsByKey = _.groupBy(items, key);
  return ids.map(id => {
    if (id in itemsByKey) {
      return itemsByKey[id][0];
    }

    return null;
  });
};

/**
 * SharedCacheDataLoader provides a version of the DataLoader that wraps up a
 * redis backed cache with the dataloader's request cache.
 */
class SharedCacheDataLoader extends DataLoader {
  constructor(prefix, expiry, batchLoadFn, options) {
    super(
      SharedCacheDataLoader.batchLoadFn(prefix, expiry, batchLoadFn),
      options
    );

    // Expiry is provided as a number in ms, we're using commands optimized for
    // seconds, so convert this to seconds.
    this._expiry = Math.floor(expiry / 1000);
    this._prefix = prefix;
    this._keyFunc = SharedCacheDataLoader.keyFunc(this._prefix);
  }

  /**
   * clear the key from the shared cache and the request cache
   */
  clear(key) {
    return cache.invalidate(key, this._keyFunc).then(() => super.clear(key));
  }

  /**
   * prime the shared cache and the request cache
   */
  prime(key, value) {
    return cache
      .set(key, value, this._expiry, this._keyFunc)
      .then(() => super.prime(key, value));
  }

  /**
   * prime many values in the shared cache and the request cache
   */
  primeMany(keys, values) {
    return cache
      .setMany(keys, values, this._expiry, this._keyFunc)
      .then(() => keys.map((key, i) => super.prime(key, values[i])));
  }

  /**
   * wraps up the prefix needed for the redis backed shared cache driver
   */
  static keyFunc(prefix) {
    return key => `cache.sbl[${prefix}][${key}]`;
  }

  /**
   * wraps the dataloader batchLoadFn with the shared cache's wrapper
   */
  static batchLoadFn(prefix, expiry, batchLoadFn) {
    return ids =>
      cache.wrapMany(
        ids,
        expiry,
        workKeys => {
          return batchLoadFn(workKeys);
        },
        SharedCacheDataLoader.keyFunc(prefix)
      );
  }
}

/**
 * SharedCounterDataLoader is identical to SharedCacheDataLoader with the
 * exception in that it is designed to work with numerical cached data.
 */
class SharedCounterDataLoader extends SharedCacheDataLoader {
  /**
   * Increments the key in the cache if it already exists in the cache, if not
   * it does nothing.
   */
  incr(key) {
    return cache.incr(key, this._expiry, this._keyFunc);
  }

  /**
   * Decrements the key in the cache if it already exists in the cache, if not
   * it does nothing.
   */
  decr(key) {
    return cache.decr(key, this._expiry, this._keyFunc);
  }
}

/**
 * Maps an object's paths to a string that can be used as a cache key.
 * @param  {Array} paths paths on the object to be used to generate the cache
 *                       key
 */
const objectCacheKeyFn = (...paths) => obj => {
  return paths.map(path => obj[path]).join(':');
};

/**
 * Maps an object's paths to a string that can be used as a cache key.
 * @param  {Array} paths paths on the object to be used to generate the cache
 *                       key
 */
const arrayCacheKeyFn = arr => {
  return arr.sort().join(':');
};

module.exports = {
  singleJoinBy,
  arrayJoinBy,
  objectCacheKeyFn,
  arrayCacheKeyFn,
  SingletonResolver,
  SharedCacheDataLoader,
  SharedCounterDataLoader,
};
