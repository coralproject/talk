/**
 * Wraps up a promise to return an object with the resolution of the promise
 * keyed at `key` or an error caught at `errors`.
 */
const wrapResponse = (key) => (promise) => {
  return promise.then((value) => {
    let res = {};
    if (key) {
      res[key] = value;
    }
    return res;
  }).catch((err) => ({
    errors: [err]
  }));
};

const RootMutation = {
  createComment(_, {asset_id, parent_id, body}, {mutators: {Comment}}) {
    return wrapResponse('comment')(Comment.create({asset_id, parent_id, body}));
  },
  createLike(_, {like: {item_id, item_type}}, {mutators: {Action}}) {
    return wrapResponse('like')(Action.create({item_id, item_type, action_type: 'LIKE'}));
  },
  createFlag(_, {flag: {item_id, item_type, reason, message}}, {mutators: {Action}}) {
    return wrapResponse('flag')(Action.create({item_id, item_type, action_type: 'FLAG', group_id: reason, metadata: {message}}));
  },
  deleteAction(_, {id}, {mutators: {Action}}) {
    return wrapResponse(null)(Action.delete({id}));
  },
  setUserStatus(_, {id, status}, {mutators: {User}}) {
    return User.setUserStatus({id, status});
  }
};

module.exports = RootMutation;
