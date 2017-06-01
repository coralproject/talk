import update from 'immutability-helper';

function findAndInsertComment(parent, id, comment) {
  const [connectionField, countField, action] = parent.comments
    ? ['comments', 'commentCount', '$unshift']
    : ['replies', 'replyCount', '$push'];

  if (!id || parent.id === id) {
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
         nodes.map((node) => findAndInsertComment(node, id, comment))
      },
    },
  });
}

export function insertCommentIntoEmbedQuery(root, id, comment) {

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
            $apply: (node) => findAndInsertComment(node, id, comment),
          },
        },
      });
    }
    return update(root, {
      comment: {
        $apply: (node) => findAndInsertComment(node, id, comment),
      },
    });
  }
  return update(root, {
    asset: {$apply: (asset) => findAndInsertComment(asset, id, comment)},
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
    changes[countField] = {$set: changes[countField] - 1};
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
