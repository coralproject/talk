const TagModel = require('../models/tag');

const ALLOWED_COMMENT_TAGS = [
  {name: 'STAFF'},
  {name: 'BEST'},
];

module.exports = class TagsService {

  /**
   * Finds an action by the id.
   * @param {String} id  identifier of the tag (uuid)
  */
  static findById(id) {
    return TagModel.findOne({id});
  }

  /**
   * Add a tag.
   * @param {string} name the actual tag
   * @param {String} item_id  identifier of the comment  (uuid)
   * @param {String} item_type  type of the object being tag  (COMMENTS)
   * @param {String} user_id  user id that assigned the tag (uuid)
   * @param {String} privacy_type visibility of the tag on the comment
   * @return {Promise}
   */
  static insertCommentTag(tag) {

    if (ALLOWED_COMMENT_TAGS.find((t) => t.name === tag.name) == null) {
      return Promise.reject(new Error('tag not allowed'));
    }

    // Tags are made unique by using a query that can be reproducable, i.e.,
    // not containing user inputable values.
    let query = {
      name: tag.name,
      item_id: tag.item_id,
      item_type: tag.item_type,
      assigned_by: tag.user_id,
      privacy_type: tag.privacy_type
    };

    // Create/Update the tag.
    return TagModel.findOneAndUpdate(query, tag, {

      // Ensure that if it's new, we return the new object created.
      new: true,

      // Perform an upsert in the event that this doesn't exist.
      upsert: true,

      // Set the default values if not provided based on the mongoose models.
      setDefaultsOnInsert: true
    })
    .then(({nModified}) => {
      switch (nModified) {
      case 0:

        // either the tag was already there, or the comment doesn't exist with that id...
        throw new Error('Could not add tag to comment. Either the comment doesn\'t exist or the tag is already present.');
      case 1:

          // tag added
        return;
      default:

        // this should never happen because no multi parameter and unique index on id
      }
    });
  }

};
