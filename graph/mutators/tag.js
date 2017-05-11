const TagsService = require('../../services/tags');
const errors = require('../../errors');

/**
 * Modifies the targeted model with the specified operation to add/remove a tag.
 */
const modify = async ({user}, operation, {name, id, item_type, asset_id}) => {

  // Try to find the tag in the global list. This will contain the permission
  // information if it's found.
  let tag = await TagsService.get({name, id, item_type, asset_id});

  // Create the new tagLink that will be created to interact to the comment.
  let tagLink = {
    tag,
    assigned_by: user.id,
    created_at: new Date()
  };

  // If the tag was found, we need to ensure that the current user can indeed
  // modify this tag on the comment.
  if (tag) {
    
    // If the tag has roles defined, and the current user has at least one of
    // the required roles, then modify the tag without checking for ownership.
    if (tag.permissions && tag.permissions.roles && tag.permissions.roles.some((role) => user.roles.include(role))) {
      return operation(id, item_type, tagLink, false);
    }

    // If the permissions allow for self assignment, then ensure that the query
    // is compose with that in mind.
    if (tag.permissions && tag.permissions.self) {

      // Otherwise, we assume that we have to check to see that the user indeed
      // owns the resource before allowing the tag to get modified.
      return operation(id, item_type, tagLink, true);
    }

    throw errors.ErrNotAuthorized;
  }

  // Only admin/moderators can modify unique tags, these are tags that are not
  // in the global list.
  if (!(user.hasRoles('ADMIN') || user.hasRoles('MODERATOR'))) {
    throw errors.ErrNotAuthorized;
  }

  // Generate the tag in the event now that we have to create the tag for this
  // specific comment.
  tagLink.tag = {
    name,
    permissions: {
      public: true,
      self: false,
      roles: []
    },
    models: [item_type],
    created_at: new Date()
  };

  // Actually modify the tag on the model.
  return operation(id, item_type, tagLink, false);
};

module.exports = (context) => {
  let mutators = {
    Tag: {
      add: () => Promise.reject(errors.ErrNotAuthorized),
      remove: () => Promise.reject(errors.ErrNotAuthorized)
    }
  };

  if (context.user && context.user.can('mutation:addTag')) {
    mutators.Tag.add = (tag) => modify(context, TagsService.add, tag);
  }

  if (context.user && context.user.can('mutation:removeTag')) {
    mutators.Tag.remove = (tag) => modify(context, TagsService.remove, tag);
  }

  return mutators;
};
