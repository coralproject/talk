const TagsService = require('../../services/tags');
const { ErrNotAuthorized } = require('../../errors');
const {
  ADD_COMMENT_TAG,
  REMOVE_COMMENT_TAG,
} = require('../../perms/constants');

/**
 * Modifies the targeted model with the specified operation to add/remove a tag.
 */
const modify = async (
  { user, loaders: { Tags } },
  operation,
  { name, id, item_type, asset_id }
) => {
  // Get the global list of tags from the dataloader.
  const tags = await Tags.getAll.load({ id, item_type, asset_id });

  // Resolve the TagLink that should be used to insert to the user. This will
  // additionally return with an ownership property that can be used to determine
  // that the user who adds this tag must also be the owner of the resource.
  let { tagLink, ownership } = TagsService.resolveLink(user, tags, {
    name,
    item_type,
  });

  // Actually modify the tag on the model.
  return operation(id, item_type, tagLink, ownership);
};

module.exports = context => {
  let mutators = {
    Tag: {
      add: () => Promise.reject(new ErrNotAuthorized()),
      remove: () => Promise.reject(new ErrNotAuthorized()),
    },
  };

  if (context.user && context.user.can(ADD_COMMENT_TAG)) {
    mutators.Tag.add = tag => modify(context, TagsService.add, tag);
  }

  if (context.user && context.user.can(REMOVE_COMMENT_TAG)) {
    mutators.Tag.remove = tag => modify(context, TagsService.remove, tag);
  }

  return mutators;
};
