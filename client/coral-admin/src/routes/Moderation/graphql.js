import update from 'immutability-helper';

const limit = 10;

const ascending = (a, b) => {
  const dateA = new Date(a.created_at);
  const dateB = new Date(b.created_at);
  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
};

const descending = (a, b) => -ascending(a, b);

function queueHasComment(root, queue, id) {
  return root[queue].nodes.find(c => c.id === id);
}

function removeCommentFromQueue(root, queue, id) {
  const changes = {
    [queue]: {
      nodes: { $apply: nodes => nodes.filter(c => c.id !== id) },
    },
  };
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

function increaseCommentCount(root, queue) {
  const changes = {
    [`${queue}Count`]: { $set: root[`${queue}Count`] + 1 },
  };
  return update(root, changes);
}

function decreaseCommentCount(root, queue) {
  const changes = {
    [`${queue}Count`]: { $set: root[`${queue}Count`] - 1 },
  };
  return update(root, changes);
}

function addCommentToQueue(root, queue, comment, sortOrder) {
  const cursor = new Date(root[queue].startCursor);
  const date = new Date(comment.created_at);

  let append = sortOrder === 'ASC' ? date >= cursor : date <= cursor;

  const nodes = append
    ? root[queue].nodes.concat(comment)
    : [comment].concat(...root[queue].nodes);

  const changes = {
    [queue]: {
      nodes: { $set: nodes },
    },
  };

  return update(root, changes);
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
  Object.keys(queueConfig).forEach(key => {
    if (commentBelongToQueue(key, comment, queueConfig)) {
      queues.push(key);
    }
  });
  return queues;
}

function getOlderDate(a, b) {
  if (a) {
    a = new Date(a);
  }
  if (b) {
    b = new Date(b);
  }

  if (!b) {
    return a;
  }

  if (!a) {
    return b;
  }
  return a < b ? b : a;
}

function determineLatestChange(comment) {
  let lc = null;

  comment.body_history.forEach(item => {
    lc = getOlderDate(lc, item.created_at);
  });

  comment.status_history.forEach(item => {
    lc = getOlderDate(lc, item.created_at);
  });

  comment.actions.forEach(item => {
    lc = getOlderDate(lc, item.created_at);
  });

  return lc;
}

function reconstructPreviousCommentState(comment) {
  const statusHistory = comment.status_history;
  const bodyHistory = comment.body_history;
  const actions = comment.actions;
  const lastChangeDate = determineLatestChange(comment);
  const previousComment = {
    ...comment,
    body_history: bodyHistory.filter(
      item => new Date(item.created_at) < lastChangeDate
    ),
    status_history: statusHistory.filter(
      item => new Date(item.created_at) < lastChangeDate
    ),
    actions: actions.filter(item => new Date(item.created_at) < lastChangeDate),
  };

  // Comment did not exist previously.
  if (!previousComment.status_history.length) {
    return null;
  }

  previousComment.status =
    previousComment.status_history[
      previousComment.status_history.length - 1
    ].type;

  previousComment.body =
    previousComment.body_history[previousComment.body_history.length - 1].body;

  return previousComment;
}

/**
 * getPreviousCommentQueues determines queues that this comment previously belonged to.
 */
function getPreviousCommentQueues(comment, queueConfig) {
  const previousCommentState = reconstructPreviousCommentState(comment);

  if (!previousCommentState) {
    return [];
  }

  return getCommentQueues(previousCommentState, queueConfig);
}

/**
 * Return whether or not the comment belongs to the queue.
 */
export function commentBelongToQueue(queue, comment, queueConfig) {
  const { action_type, statuses, tags } = queueConfig[queue];
  let belong = true;
  if (statuses && statuses.indexOf(comment.status) === -1) {
    belong = false;
  }
  if (
    tags &&
    (!comment.tags ||
      !comment.tags.some(tagLink => tags.indexOf(tagLink.tag.name) >= 0))
  ) {
    belong = false;
  }
  if (
    action_type &&
    (!comment.actions ||
      !comment.actions.some(
        a => a.__typename.toLowerCase() === `${action_type.toLowerCase()}action`
      ))
  ) {
    belong = false;
  }
  return belong;
}

function isVisible(id) {
  return !!document.getElementById(`comment_${id}`);
}

function isEndOfListVisible(root, queue) {
  return (
    root[queue].nodes.length === 0 ||
    !!document.getElementById('end-of-comment-list')
  );
}

function applyCommentChanges(root, comment, queueConfig) {
  const queues = Object.keys(queueConfig);
  for (let i = 0; i < queues.length; i++) {
    const queue = queues[i];
    const index = root[queue].nodes.findIndex(({ id }) => id === comment.id);
    if (index > -1) {
      return update(root, {
        [queue]: {
          nodes: {
            [index]: { $merge: comment },
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
    nodes = root[queue].nodes.filter(comment =>
      commentBelongToQueue(queue, comment, queueConfig)
    );
  }

  nodes = sortComments(nodes, sortOrder);

  if (nodes.length > 100) {
    nodes = nodes.slice(0, 100);
    hasNextPage = true;
  }

  return update(root, {
    [queue]: {
      nodes: { $set: nodes },
      endCursor: { $set: nodes[nodes.length - 1].created_at },
      hasNextPage: { $set: hasNextPage },
    },
  });
}

/**
 * Assimilate comment changes into current store.
 * @param  {Object}   root               current state of the store
 * @param  {Object}   comment            comment that was changed
 * @param  {string}   sortOrder          current sort order of the queues
 * @param  {function} notify             callback to show notification
 *                                       in the current active queue besides the 'all' queue.
 * @param  {Object}   queueConfig        queue configuration
 * @return {Object}                      next state of the store
 */
export function handleCommentChange(
  root,
  comment,
  sortOrder,
  notify,
  queueConfig,
  activeQueue
) {
  let next = root;

  // Queues that this comment previously belonged to.
  const prevQueues = getPreviousCommentQueues(comment, queueConfig);

  // Queues that this comment needs to be placed.
  const nextQueues = getCommentQueues(comment, queueConfig);

  let notificationShown = false;
  const showNotificationOnce = () => {
    if (notificationShown) {
      return;
    }
    notify();
    notificationShown = true;
  };

  Object.keys(queueConfig).forEach(queue => {
    // Comment should be placed in queue.
    if (nextQueues.indexOf(queue) >= 0) {
      // Comment was not previously in this queue.
      if (prevQueues.indexOf(queue) === -1) {
        // Increase count.
        next = increaseCommentCount(next, queue);
      }

      if (!queueHasComment(next, queue, comment.id)) {
        // Check if comment would be in the current view.
        if (shouldCommentBeAdded(root, queue, comment, sortOrder)) {
          next = addCommentToQueue(next, queue, comment, sortOrder);

          // This will limit queue sizes.
          if (activeQueue !== queue) {
            cleanUpQueue(next, queue, sortOrder);
          }
        }

        // Show notification if end of list is visible.
        if (
          notify &&
          activeQueue === queue &&
          isEndOfListVisible(root, queue)
        ) {
          showNotificationOnce();
        }
      }
    } else if (prevQueues.indexOf(queue) >= 0) {
      // Comment previously was in this queue, but not anymore.

      // If action was performed by another user, keep a dangling comment.
      const dangling =
        activeQueue === queue &&
        comment.status_history[comment.status_history.length - 1].assigned_by
          .id !== root.me.id;

      // Otherwise remove it
      if (!dangling) {
        next = removeCommentFromQueue(next, queue, comment.id);
      }

      // In any case decrease comment count.
      next = decreaseCommentCount(next, queue);
    } else if (queueHasComment(next, queue, comment.id)) {
      // Comment does not belong to his queue and did not belong to this queue previously.
      // Must be a dangling comment that the current user took action on.
      // Remove it completely from the queue.
      next = removeCommentFromQueue(next, queue, comment.id);
    }

    // Show notification if operation affected a currently visible comment.
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

const indicatorQueues = ['premod', 'reported'];

/**
 * Track indicator status
 * @param  {Object}   root     current state of the store
 * @param  {Object}   comment  comment that was changed
 * @return {Object}            next state of the store
 */
export function handleIndicatorChange(root, comment, queueConfig) {
  let next = root;

  // Queues that this comment previously belonged to.
  const prevQueues = getPreviousCommentQueues(comment, queueConfig);

  // Queues that this comment needs to be placed.
  const nextQueues = getCommentQueues(comment, queueConfig);

  for (const queue of indicatorQueues) {
    if (prevQueues.indexOf(queue) === -1 && nextQueues.indexOf(queue) >= 0) {
      next = increaseCommentCount(next, queue);
    }
    if (prevQueues.indexOf(queue) >= 0 && nextQueues.indexOf(queue) === -1) {
      next = decreaseCommentCount(next, queue);
    }
  }

  return next;
}

export const subscriptionFields = `
  status
  body
  body_history {
    body
    created_at
  }
  actions {
    __typename
    created_at
  }
  status_history {
    type
    assigned_by {
      id
      username
    }
    created_at
  }
  updated_at
  created_at
`;
