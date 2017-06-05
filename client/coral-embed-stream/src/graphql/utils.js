import update from 'immutability-helper';

function findAndInsertComment(parent, comment) {
  const [connectionField, countField, action] = parent.comments
    ? ['comments', 'commentCount', '$unshift']
    : ['replies', 'replyCount', '$push'];

  if (!comment.parent || parent.id === comment.parent.id) {
    return update(parent, {
      [connectionField]: {
        nodes: {[action]: [comment]},
      },
      [countField]: {$apply: (c) => c + 1},
    });
  }
  const connection = parent[connectionField];
  if (!connection) {
    return parent;
  }
  return update(parent, {
    [connectionField]: {
      nodes: {
        $apply: (nodes) =>
         nodes.map((node) => findAndInsertComment(node, comment))
      },
    },
  });
}

export function insertCommentIntoEmbedQuery(root, comment) {

  // Increase total comment count by one.
  root = update(root, {
    asset: {
      totalCommentCount: {$apply: (c) => c + 1},
    },
  });

  if (root.comment) {
    if (root.comment.parent) {
      return update(root, {
        comment: {
          parent: {
            $apply: (node) => findAndInsertComment(node, comment),
          },
        },
      });
    }
    return update(root, {
      comment: {
        $apply: (node) => findAndInsertComment(node, comment),
      },
    });
  }
  return update(root, {
    asset: {$apply: (asset) => findAndInsertComment(asset, comment)},
  });
}

function findAndRemoveComment(parent, id) {
  const [connectionField, countField] = parent.comments
    ? ['comments', 'commentCount']
    : ['replies', 'replyCount'];

  const connection = parent[connectionField];
  if (!connection) {
    return parent;
  }

  let next = connection.nodes.filter((node) => node.id !== id);
  if (next.length === connection.nodes.length) {
    next = next.map((node) => findAndRemoveComment(node, id));
  }
  let changes = {
    [connectionField]: {
      nodes: {$set: next},
    },
  };

  if (parent[countField] && next.length !== connection.nodes.length) {
    changes[countField] = {$set: parent[countField] - 1};
  }
  return update(parent, changes);
}

export function removeCommentFromEmbedQuery(root, id) {

  // Decrease total comment by one.
  root = update(root, {
    asset: {
      totalCommentCount: {$apply: (c) => c - 1},
    },
  });

  if (root.comment) {
    if (root.comment.parent) {
      return update(root, {
        comment: {
          parent: {
            $apply: (node) => findAndRemoveComment(node, id),
          },
        },
      });
    }
    return update(root, {
      comment: {
        $apply: (node) => findAndRemoveComment(node, id),
      },
    });
  }
  return update(root, {
    asset: {$apply: (asset) => findAndRemoveComment(asset, id)},
  });
}

function findComment(nodes, callback) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (callback(node)) {
      return node;
    }
    if (node.replies) {
      const find = findComment(node.replies.nodes, callback);
      if (find){
        return find;
      }
    }
  }
  return false;
}

export function findCommentInEmbedQuery(root, callbackOrId) {
  let callback = callbackOrId;
  if (typeof callbackOrId === 'string') {
    callback = (node) => node.id === callbackOrId;
  }
  if (root.comment) {
    if (callback(root.comment)) {
      return root.comment;
    }
    if (root.comment.parent && callback(root.comment.parent)) {
      return root.comment.parent;
    }
  }
  if (!root.asset.comments) {
    return false;
  }
  return findComment(root.asset.comments.nodes, callback);
}
