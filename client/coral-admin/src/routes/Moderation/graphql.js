import update from 'immutability-helper';

const limit = 10;

const ascending = (a, b) => {
  const dateA = new Date(a.created_at);
  const dateB = new Date(b.created_at);
  if (dateA < dateB) { return -1; }
  if (dateA > dateB) { return 1; }
  return 0;
};

const descending = (a, b) => -ascending(a, b);

function queueHasComment(root, queue, id) {
  return root[queue].nodes.find((c) => c.id === id);
}

function removeCommentFromQueue(root, queue, id, dangling = false) {
  if (!queueHasComment(root, queue, id)) {
    return root;
  }
  const changes = {
    [`${queue}Count`]: {$set: root[`${queue}Count`] - 1},
  };

  if (!dangling) {
    changes[queue] = {
      nodes: {$apply: (nodes) => nodes.filter((c) => c.id !== id)},
    };
  }

  return update(root, changes);
}

function shouldCommentBeAdded(root, queue, comment, sortOrder) {
  if (root[`${queue}Count`] < limit) {

    // Adding all comments until first limit has reached.
    return true;
  }
  const cursor = new Date(root[queue].endCursor);
  return sortOrder === 'ASC'
    ? new Date(comment.created_at) <= cursor
    : new Date(comment.created_at) >= cursor;
}

function addCommentToQueue(root, queue, comment, sortOrder, cleanup) {
  if (queueHasComment(root, queue, comment.id)) {
    return root;
  }

  const changes = {
    [`${queue}Count`]: {$set: root[`${queue}Count`] + 1},
  };

  if (!shouldCommentBeAdded(root, queue, comment, sortOrder)) {
    return update(root, changes);
  }

  const cursor = new Date(root[queue].startCursor);
  const date = new Date(comment.created_at);

  let append = sortOrder === 'ASC'
    ? date >= cursor
    : date <= cursor;

  const nodes = append
    ? root[queue].nodes.concat(comment)
    : [comment].concat(...root[queue].nodes);

  changes[queue] = {
    nodes: {$set: nodes},
  };

  const next = update(root, changes);

  if (!cleanup) {
    return next;
  }

  return cleanUpQueue(next, queue, sortOrder);
}

function sortComments(nodes, sortOrder) {
  const sortAlgo = sortOrder === 'ASC' ? ascending : descending;
  return nodes.sort(sortAlgo);
}

/**
 * getCommentQueues determines in which queues a comment should be placed.
 */
function getCommentQueues(comment, queueConfig) {
  const queues = [];
  Object.keys(queueConfig).forEach((key) => {
    if (commentBelongToQueue(key, comment, queueConfig)) {
      queues.push(key);
    }
  });
  return queues;
}

/**
 * Return whether or not the comment belongs to the queue.
 */
export function commentBelongToQueue(queue, comment, queueConfig) {
  const {action_type, statuses, tags} = queueConfig[queue];
  let belong = true;
  if (statuses && statuses.indexOf(comment.status) === -1) {
    belong = false;
  }
  if (tags && (!comment.tags || !comment.tags.some((tagLink) => tags.indexOf(tagLink.tag.name) >= 0))) {
    belong = false;
  }
  if (action_type && (!comment.actions || !comment.actions.some((a) => a.__typename.toLowerCase() === `${action_type.toLowerCase()}action`))) {
    belong = false;
  }
  return belong;
}

function isVisible(id) {
  return !!document.getElementById(`comment_${id}`);
}

function isEndOfListVisible(root, queue) {
  return root[queue].nodes.length === 0 || !!document.getElementById('end-of-comment-list');
}

function applyCommentChanges(root, comment, queueConfig) {
  const queues = Object.keys(queueConfig);
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    const index = root[queue].nodes.findIndex(({id}) => id === comment.id);
    if (index > -1) {
      return update(root, {
        [queue]: {
          nodes: {
            [index]: {$merge: comment},
          },
        },
      });
    }
  }
  return root;
}

/**
 * Remove dangling comments, sort and resize queues.
 * If queueConfig is omitted, dangling comments are not removed.
 */
export function cleanUpQueue(root, queue, sortOrder, queueConfig) {
  let nodes = root[queue].nodes;
  let hasNextPage = root[queue].hasNextPage;

  if (!nodes.length) {
    return root;
  }

  if (queueConfig) {
    nodes = root[queue].nodes.filter((comment) => commentBelongToQueue(queue, comment, queueConfig));
  }

  nodes = sortComments(
    nodes,
    sortOrder,
  );

  if (nodes.length > 100) {
    nodes = nodes.slice(0, 100);
    hasNextPage = true;
  }

  return update(root, {
    [queue]: {
      nodes: {$set: nodes},
      endCursor: {$set: nodes[nodes.length - 1].created_at},
      hasNextPage: {$set: hasNextPage},
    },
  });
}

/**
 * Assimilate comment changes into current store.
 * @param  {Object} root               current state of the store
 * @param  {Object} comment            comment that was changed
 * @param  {string} sortOrder          current sort order of the queues
 * @param  {string} notify             callback to show notification
 *                                     in the current active queue besides the 'all' queue.
 * @param  {Object} queueConfig        queue configuration
 * @return {Object}                    next state of the store
 */
export function handleCommentChange(root, comment, sortOrder, notify, queueConfig, activeQueue) {
  let next = root;

  const nextQueues = getCommentQueues(comment, queueConfig);

  let notificationShown = false;
  const showNotificationOnce = () => {
    if (notificationShown) {
      return;
    }
    notify();
    notificationShown = true;
  };

  Object.keys(queueConfig).forEach((queue) => {
    if (nextQueues.indexOf(queue) >= 0) {
      if (!queueHasComment(next, queue, comment.id)) {
        next = addCommentToQueue(next, queue, comment, sortOrder, activeQueue !== queue);
        if (notify && activeQueue === queue && isEndOfListVisible(root, queue)) {
          showNotificationOnce();
        }
      }
    } else if(queueHasComment(next, queue, comment.id)){
      const dangling = activeQueue === queue && comment.status_history[comment.status_history.length - 1].assigned_by.id !== root.me.id;
      next = removeCommentFromQueue(next, queue, comment.id, dangling);
      if (notify && isVisible(comment.id)) {
        showNotificationOnce();
      }
    }

    if (notify && isVisible(comment.id)) {
      showNotificationOnce();
    }

    // We need to apply every comment change, because we use
    // batched subscription handler which bypasses apollo that would
    // have done that for us.
    next = applyCommentChanges(next, comment, queueConfig);
  });
  return next;
}
