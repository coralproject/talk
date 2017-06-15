const wrapResponse = require('../helpers/response');

const RootMutation = {
  createComment(_, {comment}, {mutators: {Comment}}) {
    return wrapResponse('comment')(Comment.create(comment));
  },
  editComment(_, {id, asset_id, edit: {body}}, {mutators: {Comment}}) {
    return wrapResponse('comment')(Comment.edit({id, asset_id, edit: {body}}));
  },
  createFlag(_, {flag: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return wrapResponse('flag')(Action.create({item_id, item_type, action_type: 'FLAG', group_id: reason, metadata: {message}}));
  },
  createDontAgree(_, {dontagree: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return wrapResponse('dontagree')(Action.create({item_id, item_type, action_type: 'DONTAGREE', group_id: reason, metadata: {message}}));
  },
  deleteAction(_, {id}, {mutators: {Action}}) {
    return wrapResponse(null)(Action.delete({id}));
  },
  setUserStatus(_, {id, status}, {mutators: {User}}) {
    return wrapResponse(null)(User.setUserStatus({id, status}));
  },
  suspendUser(_, {input: {id, message, until}}, {mutators: {User}}) {
    return wrapResponse(null)(User.suspendUser({id, message, until}));
  },
  rejectUsername(_, {input: {id, message}}, {mutators: {User}}) {
    return wrapResponse(null)(User.rejectUsername({id, message}));
  },
  ignoreUser(_, {id}, {mutators: {User}}) {
    return wrapResponse(null)(User.ignoreUser({id}));
  },
  stopIgnoringUser(_, {id}, {mutators: {User}}) {
    return wrapResponse(null)(User.stopIgnoringUser({id}));
  },
  setCommentStatus: async (_, {id, status}, {mutators: {Comment}, user, pubsub}) => {
    const comment = await Comment.setStatus({id, status});

    if (pubsub) {

      // Publish the comment status change via the subscription.
      pubsub.publish('commentStatusChanged', {user, comment});
    }

    return wrapResponse(null)(comment);
  },
  addTag(_, {tag}, {mutators: {Tag}}) {
    return wrapResponse(null)(Tag.add(tag));
  },
  removeTag(_, {tag}, {mutators: {Tag}}) {
    return wrapResponse(null)(Tag.remove(tag));
  }
};

module.exports = RootMutation;
