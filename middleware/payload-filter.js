// The maximum depth to recurse into nested objects checking for mongoose
// objects.
const maxRecursion = 3;

/**
 * Middleware to wrap the `res.json` function to ensure that we can filter the
 * payload response first based on user and role.
 */
module.exports = (req, res, next) => {
  /**
   * Updates the original document based on filtering out for roles.
   * @param  {Mixed}   o original object to be modified
   * @param  {Integer} l current level of depth in the first object
   * @return {Mixed}     (possibly) modified object
   */
  const wrap = (o, d = 0) => {
    if (d > maxRecursion) {
      return o;
    }

    // If this is an array, we need to walk over all the object's elements.
    if (Array.isArray(o)) {

      // Map each of the array elements.
      return o.map((ob) => wrap(ob, d + 1));

    } else if (o && o.constructor && o.constructor.name === 'model') {

      // The object here is definitly a mongoose model.

      // Check to see if it has a `filterForUser` method.
      if (typeof o.filterForUser === 'function') {

        // The object here actually has the `filterForUser` function, so filter
        // the object!
        o = o.filterForUser(req.user);
      }

    } else if (typeof o === 'object') {

      // Iterate over the props, find only properties owned by the object.
      for (let prop in o) {

        // If and only if the object owns the property do we actually pull the
        // property out.
        if (typeof o.hasOwnProperty === 'function' && o.hasOwnProperty(prop)) {

          // Wrap the property with one more layer down.
          o[prop] = wrap(o[prop], d + 1);
        }
      }

    }

    return o;
  };

  // Save a reference to the original json function.
  const json = res.json;

  // Override the original json function.
  res.json = (payload) => {

    // Restore the old pointer.
    res.json = json;

    // Send it down the pipe after we've filtered it.
    res.json(wrap(payload));
  };

  // Now that we've overridden the `res.json`, let's hand it down.
  next();
};
