const CommentModel = require('../models/comment');
const AssetModel = require('../models/asset');
const UserModel = require('../models/user');

const AssetsService = require('./assets');
const SettingsService = require('./settings');

const updateModel = async (item_type, query, update) => {

  // Get the model to update with.
  let Model;
  switch (item_type) {
  case 'COMMENTS':
    Model = CommentModel;
    break;
  case 'ASSETS':
    Model = AssetModel;
    break;
  case 'USERS':
    Model = UserModel;
    break;
  default:
    throw new Error(`item_type ${item_type} is not a valid item_type to update a tag on`);
  }

  // Execute the update operation.
  return Model.update(query, update);
};

const ownershipQuery = async (item_type, link, query) => {
  switch (item_type) {
  case 'COMMENTS':
    query['author_id'] = link.assigned_by;
    break;
  case 'USERS':
    query['id'] = link.assigned_by;
    break;
  }
};

class TagsService {

  /**
   * Retrives a global tag from the settings based on the input_type.
   */
  static async get({name, id, item_type, asset_id = null}) {

    // Extract the settings from the database.
    let settings;
    switch (item_type) {
    case 'COMMENTS':
      settings = await AssetsService.rectifySettings(AssetsService.findById(asset_id));
      break;
    case 'ASSETS':
      settings = await AssetsService.rectifySettings(AssetsService.findById(id));
      break;
    case 'USERS':
      settings = await SettingsService.retrieve();
      break;
    default:
      settings = await SettingsService.retrieve();
      break;
    }

    // Extract the tags from the settings object.
    let {tags = []} = settings;

    // Return the first tag that matches the requested form.
    return tags.find((tag) => tag.name === name && tag.models.include(item_type));
  }

  /**
   * Adds a TagLink to a Model, optionally checking for ownership.
   */
  static async add(id, item_type, link, ownershipCheck) {

    // Compose the query to find the comment.
    const query = {
      id,
      'tags.tag.name': {
        $ne: link.tag.name
      }
    };

    // If ownership verification is required, ensure that the person that is
    // assigning the tag is the same person that owns the comment.
    if (ownershipCheck) {

      // Modify the query to support an ownership verification.
      ownershipQuery(item_type, link, query);
    }

    // Get the Model to perform the update.
    return updateModel(item_type, query, {
      $push: {
        tags: link
      }
    });
  }

  /**
   * Removes a TagLink to a Model, optionally checking for ownership.
   */
  static async remove(id, item_type, link, ownershipCheck) {

    // Compose the query to find the comment.
    const query = {
      id,
      'tags.tag.name': {
        $eq: link.tag.name
      }
    };

    // If ownership verification is required, ensure that the person that is
    // assigning the tag is the same person that owns the comment.
    if (ownershipCheck) {

      // Modify the query to support an ownership verification.
      ownershipQuery(item_type, link, query);
    }

    // Get the Model to perform the update.
    return updateModel(item_type, query, {
      $pull: {
        tags: {
          name: link.tag.name
        }
      }
    });
  }
}

module.exports = TagsService;
