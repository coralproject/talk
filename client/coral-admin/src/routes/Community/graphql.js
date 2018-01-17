import update from 'immutability-helper';

function shouldAddFlaggedUser(root, user) {
  const isEmpty = !root.flaggedUsers.nodes.length;
  if (isEmpty) {
    return true;
  }

  if (hasFlaggedUser(root, user)) {
    return false;
  }

  const oldest = root.flaggedUsers.nodes.reduce((cur, node) => {
    const createdAt = new Date(node.created_at);
    return createdAt < cur ? createdAt : cur;
  }, new Date());

  return new Date(user.created_at) >= oldest;
}

function hasFlaggedUser(root, user) {
  return root.flaggedUsers.nodes.find(u => u.id === user.id);
}

function applyUserChanges(root, user) {
  const index = root.flaggedUsers.nodes.findIndex(({ id }) => id === user.id);
  if (index > -1) {
    return update(root, {
      flaggedUsers: {
        nodes: {
          [index]: { $merge: user },
        },
      },
    });
  }
  return root;
}

function incrementFlaggedUserCount(root) {
  return update(root, {
    flaggedUsernamesCount: { $apply: count => count + 1 },
  });
}

/**
 * Assimilate flagged user changes into current store.
 * @param  {Object}   root             current state of the store
 * @param  {Object}   user             user that was changed
 * @param  {function} notify           callback to show notification
 * @return {Object}                    next state of the store
 */
export function handleFlaggedUserChange(root, user, notify) {
  if (!hasFlaggedUser(root, user)) {
    switch (user.state.status.username.status) {
      case 'SET':
      case 'CHANGED':
        root = incrementFlaggedUserCount(root);

        if (!shouldAddFlaggedUser(root, user)) {
          return root;
        }

        notify();

        return update(root, {
          flaggedUsernamesCount: { $apply: count => count + 1 },
          flaggedUsers: {
            nodes: { $push: [user] },
          },
        });
        break;
      case 'APPROVED':
      case 'REJECTED':
        return root;
      default:
    }
  }

  if (hasFlaggedUser(root, user)) {
    switch (user.state.status.username.status) {
      case 'SET':
      case 'CHANGED':
        return root;
      case 'APPROVED':
      case 'REJECTED':
        notify();
        return applyUserChanges(root, user);
      default:
    }
  }
}
