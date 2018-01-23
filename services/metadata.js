/**
 * The key must be composed of alpha characters with periods seperating them.
 */
const KEY_REGEX = /^(?:[A-Za-z][A-Za-z.]*[A-Za-z])?(?:[A-Za-z]*)$/;

/**
 * Allows metadata properties to be set/unset from specific models. It is the
 * expecatation of this API that the metadata field is either accessed later
 * directly, or accessed as a result of another database load rather than
 * this service providing an interface to do so.
 *
 * @class MetadataService
 */
class MetadataService {
  /**
   * Parses a key by ensuring that if it is either a string, or an array with
   * only characters defined in the `KEY_REGEX`
   *
   * @static
   * @param {String|Array} key
   * @returns {String} string form of the key
   *
   * @memberOf Metadata
   */
  static parseKey(key) {
    if (Array.isArray(key)) {
      key = key.join('.');
    }

    if (typeof key !== 'string' || !KEY_REGEX.test(key) || key.length === 0) {
      throw new Error(`${key} is not valid, only a-zA-Z. allowed`);
    }

    return ['metadata', key].join('.');
  }

  /**
   * Sets an object on the metadata field of an object. An example could be:
   *
   * @example
   * const MetadataService = require('services/metadata');
   * const CommentModel = require('models/comment');
   *
   * // Sets the property `loaded` on the comment with `id=1`.
   * MetadataService.set(CommentModel, '1', 'loaded', true);
   *
   * @static
   * @param {mongoose.Model} model the mongoose model for the object
   * @param {String} id the value for the field `id` of the model
   * @param {String|Array} key key for the metadata field
   * @param {any} value javascript object to set the value of the metadata to
   * @returns {Promise} resolves when the update is complete
   *
   * @memberOf Metadata
   */
  static async set(model, id, key, value) {
    key = MetadataService.parseKey(key);

    return model.update(
      { id },
      {
        $set: {
          [key]: value,
        },
      }
    );
  }

  /**
   * Removes the value for the metadata field as the specific key.
   *
   * @example
   * const MetadataService = require('services/metadata');
   * const CommentModel = require('models/comment');
   *
   * // Removes the property `loaded` on the comment with `id=1`.
   * MetadataService.unset(CommentModel, '1', 'loaded');
   *
   * @static
   * @param {mongoose.Model} model the mongoose model for the object
   * @param {String} id the value for the field `id` of the model
   * @param {String|Array} key key for the metadata field
   * @returns
   *
   * @memberOf Metadata
   */
  static async unset(model, id, key) {
    key = MetadataService.parseKey(key);

    return model.update(
      { id },
      {
        $unset: { [key]: '' },
      }
    );
  }
}

module.exports = MetadataService;
