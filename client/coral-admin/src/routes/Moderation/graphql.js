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

function removeCommentFromQueue(root, queue, id) {
  if (!queueHasComment(root, queue, id)) {
    return root;
  }
  return update(root, {
    [`${queue}Count`]: {$set: root[`${queue}Count`] - 1},
    [queue]: {
      nodes: {$apply: (nodes) => nodes.filter((c) => c.id !== id)},
    },
  });
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

function addCommentToQueue(root, queue, comment, sortOrder) {
  if (queueHasComment(root, queue, comment.id)) {
    return root;
  }

  const sortAlgo = sortOrder === 'ASC' ? ascending : descending;
  const changes = {
    [`${queue}Count`]: {$set: root[`${queue}Count`] + 1},
  };

  if (shouldCommentBeAdded(root, queue, comment, sortOrder)) {
    const nodes = root[queue].nodes.concat(comment).sort(sortAlgo);
    changes[queue] = {
      nodes: {$set: nodes},
      startCursor: {$set: nodes[0].created_at},
      endCursor: {$set: nodes[nodes.length - 1].created_at},
    };
  }

  return update(root, changes);
}

/**
 * getCommentQueues determines in which queues a comment should be placed.
 */
function getCommentQueues(comment, queueConfig) {
  const queues = [];
  Object.keys(queueConfig).forEach((key) => {
    const {action_type, statuses, tags} = queueConfig[key];
    let addToQueues = true;
    if (statuses && statuses.indexOf(comment.status) === -1) {
      addToQueues = false;
    }
    if (tags && (!comment.tags || !comment.tags.some((tagLink) => tags.indexOf(tagLink.tag.name) >= 0))) {
      addToQueues = false;
    }
    if (action_type && (!comment.actions || !comment.actions.some((a) => a.__typename.toLowerCase() === `${action_type.toLowerCase()}action`))) {
      addToQueues = false;
    }
    if (addToQueues) {
      queues.push(key);
    }
  });
  return queues;
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
        next = addCommentToQueue(next, queue, comment, sortOrder);
        if (notify && activeQueue === queue && shouldCommentBeAdded(next, queue, comment, sortOrder)) {
          showNotificationOnce();
        }
      }
    } else if(queueHasComment(next, queue, comment.id)){
      next = removeCommentFromQueue(next, queue, comment.id);
      if (notify && activeQueue === queue) {
        showNotificationOnce();
      }
    }

    if (
      notify
      && queueHasComment(next, queue, comment.id)
      && activeQueue === queue
    ) {
      showNotificationOnce();
    }
  });
  return next;
}
