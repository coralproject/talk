const Comment = require('../models/comment');
const Asset = require('../models/asset');
const User = require('../models/user');
const Assets = require('./assets');
const Settings = require('./settings');
const { ADD_COMMENT_TAG } = require('../perms/constants');
const { ErrNotAuthorized } = require('../errors');

const updateModel = async (item_type, query, update) => {
  // Get the model to update with.
  let Model;
  switch (item_type) {
    case 'COMMENTS':
      Model = Comment;

      // Don't allow adding tags to deleted comments.
      query.deleted_at = null;

      break;
    case 'ASSETS':
      Model = Asset;
      break;
    case 'USERS':
      Model = User;
      break;
    default:
      throw new Error(
        `item_type ${item_type} is not a valid item_type to update a tag on`
      );
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
    default:
      break;
  }
};

class TagsService {
  /**
   * Retrieves a global tag from the settings based on the input_type.
   */
  static async getAll({ id, item_type, asset_id = null }) {
    // Optionally get an asset.
    let asset;
    if (item_type === 'COMMENTS') {
      asset = await Assets.findById(asset_id);
    } else if (item_type === 'ASSETS') {
      asset = await Assets.findById(id);
    }

    // Lodash has issues with determining property existence when the object
    // is a Mongoose model, this is likely related to how Mongoose proxies the
    // object, but this concrete check works.
    if (
      asset &&
      asset.settings &&
      asset.settings.tags &&
      Array.isArray(asset.settings.tags)
    ) {
      return asset.settings.tags;
    }

    // Extract the tags from the settings object.
    const { tags = [] } = await Settings.select('tags');

    // Return the first tag that matches the requested form.
    return tags;
  }

  /**
   * Resolves the tagLink and ownership verification requirements that should be
   * used when trying to perform tag adding/removing operations.
   */
  static resolveLink(user, tags, { name, item_type }) {
    // Try to find the tag in the global list. This will contain the permission
    // information if it's found.
    let tag = tags.find(tag => {
      return (
        tag.name === name &&
        Array.isArray(tag.models) &&
        tag.models.includes(item_type)
      );
    });

    // Create the new tagLink that will be created to interact to the comment.
    let tagLink = {
      tag,
      assigned_by: user.id,
      created_at: new Date(),
    };

    // If the tag was found, we need to ensure that the current user can indeed
    // modify this tag on the comment.
    if (tag) {
      // If the tag has roles defined, and the current user has at least one of
      // the required roles, then modify the tag without checking for ownership.
      if (
        tag.permissions &&
        tag.permissions.roles &&
        tag.permissions.roles.includes(user.role)
      ) {
        return { tagLink, ownership: false };
      }

      // If the permissions allow for self assignment, then ensure that the query
      // is compose with that in mind.
      if (tag.permissions && tag.permissions.self) {
        // Otherwise, we assume that we have to check to see that the user indeed
        // owns the resource before allowing the tag to get modified.
        return { tagLink, ownership: true };
      }

      throw new ErrNotAuthorized();
    }

    // Only admin/moderators can modify unique tags, these are tags that are not
    // in the global list.
    if (!user.can(ADD_COMMENT_TAG)) {
      throw new ErrNotAuthorized();
    }

    // Generate the tag in the event now that we have to create the tag for this
    // specific comment.
    tagLink = TagsService.newTagLink(user, { name, item_type });

    // Actually modify the tag on the model.
    return { tagLink, ownership: false };
  }

  static newTag({ name, item_type }) {
    return {
      name,
      permissions: {
        public: true,
        self: false,
        roles: [],
      },
      models: [item_type],
      created_at: new Date(),
    };
  }

  /**
   * Creates a new TagLink based on the input user and the tag data.
   */
  static newTagLink(user, tag) {
    return {
      tag: TagsService.newTag(tag),
      assigned_by: user.id,
      created_at: new Date(),
    };
  }

  /**
   * Adds a TagLink to a Model, optionally checking for ownership.
   */
  static async add(id, item_type, link, ownershipCheck) {
    // Compose the query to find the comment.
    const query = {
      id,
      'tags.tag.name': {
        $ne: link.tag.name,
      },
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
        tags: link,
      },
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
        $eq: link.tag.name,
      },
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
          'tag.name': link.tag.name,
        },
      },
    });
  }
}

module.exports = TagsService;
