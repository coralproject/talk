const TagModel = require('../models/tag');

const ALLOWED_COMMENT_TAGS = [
  {name: 'STAFF'},
  {name: 'BEST'},
];

module.exports = class TagsService {

  /**
   * Finds a tag by the id.
   * @param {String} id  identifier of the tag (uuid)
  */
  static findById(id) {
    return TagModel.findOne({id});
  }

  /**
   * Finds atag by the item_id and name.
   * @param {String} item_id  identifier of the item that the tag was applied into(uuid)
   * @param {string} name name of the tag
  */
  static findByItemIdAndName(item_id, name, item_type) {
    return TagModel.find({
      item_id,
      item_type,
      name
    });
  }

  /**
   * Finds actions in an array of ids.
   * @param {String} ids array of user identifiers (uuid)
  */
  static async findByItemIdArray(item_ids) {
    let tags = await TagModel.find({
      'item_id': {$in: item_ids}
    });

    if (tags === null) {
      return [];
    }

    return tags;
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

    // // Tags are made unique by using a query that can be reproducable, i.e.,
    // // not containing user inputable values.
    // let query = {
    //   name: tag.name,
    //   item_id: tag.item_id,
    //   item_type: tag.item_type,
    //   assigned_by: tag.user_id,
    //   privacy_type: tag.privacy_type
    // };

    // Create/Update the tag.
    let newtag = new TagModel({
      name: tag.name,
      item_id: tag.item_id,
      item_type: tag.item_type,
      assigned_by: tag.user_id,
      privacy_type: tag.privacy_type
    });
    return newtag.save();
  }

};
