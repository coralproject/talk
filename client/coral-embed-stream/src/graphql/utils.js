import update from 'immutability-helper';
import {insertCommentsSorted} from 'coral-framework/utils';

function determineCommentDepth(comment) {
  let depth = 0;
  let cur = comment;
  while (cur.parent) {
    cur = cur.parent;
    depth++;
  }
  return depth;
}

function applyToCommentsOrigin(root, callback) {
  if (root.comment) {
    let comment = root.comment;
    for (let depth = 0; depth <= determineCommentDepth(comment); depth++) {
      let changes = {$apply: (node) => node ? callback(node) : node};
      for (let i = 0; i < depth; i++) {
        changes = {parent: changes};
      }
      comment = update(comment, changes);
    }

    return {
      ...root,
      comment,
    };
  }
  return update(root, {
    asset: {$apply: (asset) => callback(asset)},
  });
}

function findAndInsertComment(parent, comment) {
  const [connectionField, countField, action] = parent.__typename === 'Asset'
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
  return applyToCommentsOrigin(root, (origin) => findAndInsertComment(origin, comment));
}

function findAndRemoveComment(parent, id) {
  const [connectionField, countField] = parent.__typename === 'Asset'
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
  return applyToCommentsOrigin(root, (origin) => findAndRemoveComment(origin, id));
}

export function getTopLevelParent(comment) {
  if (comment.parent) {
    return getTopLevelParent(comment.parent);
  }
  return comment;
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
    return findComment([getTopLevelParent(root.comment)], callback);
  }
  if (!root.asset.comments) {
    return false;
  }
  return findComment(root.asset.comments.nodes, callback);
}

function findAndInsertFetchedComments(parent, comments, parent_id) {
  const isAsset = parent.__typename === 'Asset';
  const connectionField = isAsset ? 'comments' : 'replies';
  if (!parent_id && connectionField === 'comments' || parent.id === parent_id) {
    return update(parent, {
      [connectionField]: {
        hasNextPage: {$set: comments.hasNextPage},
        endCursor: {$set: comments.endCursor},
        nodes: {$apply: (nodes) => {
          if (isAsset) {
            return nodes.concat(comments.nodes);
          }
          return insertCommentsSorted(nodes, comments.nodes.filter(
            (comment) => !nodes.some((node) => node.id === comment.id)
          ));
        }},
      },
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
         nodes.map((node) => findAndInsertFetchedComments(node, comments, parent_id))
      },
    },
  });
}

export function insertFetchedCommentsIntoEmbedQuery(root, comments, parent_id) {
  return applyToCommentsOrigin(root, (origin) => findAndInsertFetchedComments(origin, comments, parent_id));
}

/**
 * Nest a string in itself repeatly until `level` has been reached.
 *
 * Example:
 * nest(`
 *   a
 *   ...nest
 *   b
 * `, 2)
 *
 * Output:
 * `
 *   a
 *   a
 *   b
 *   b
 * `
 */
export function nest(document, level) {
  let result = '';
  for (let x = 0; x < level; x++) {
    if (x === 0) {
      result += document;
      continue;
    }
    result = result.replace('...nest', document);
  }
  return result.replace('...nest', '');
}
