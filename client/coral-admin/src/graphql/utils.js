import update from 'immutability-helper';

export function findCommentInModQueues(root, id, queues = ['all', 'premod', 'flagged', 'accepted', 'rejected']) {
  return queues.reduce((comment, queue) => {
    return comment ? comment : root[queue].nodes.find((c) => c.id === id);
  }, null);
}

export function handleCommentStatusChange(root, {id, status}, previousStatus) {
  const comment = findCommentInModQueues(root, id);
  if (!previousStatus && comment) {
    previousStatus = comment.status;
  }

  if (status === previousStatus) {
    return root;
  }

  let acceptedNodes = root.accepted.nodes;
  let acceptedCount = root.acceptedCount;
  let rejectedNodes = root.rejected.nodes;
  let rejectedCount = root.rejectedCount;

  if (status === 'ACCEPTED') {
    acceptedCount++;
    if (comment) {
      acceptedNodes = [{...comment, status}, ...acceptedNodes];
    }
  }
  else if (status === 'REJECTED') {
    rejectedCount++;
    if (comment) {
      rejectedNodes = [{...comment, status}, ...rejectedNodes];
    }
  }

  const premodNodes = root.premod.nodes.filter((c) => c.id !== id);
  const flaggedNodes = root.flagged.nodes.filter((c) => c.id !== id);
  const premodCount = premodNodes.length < root.premod.nodes.length ? root.premodCount - 1 : root.premodCount;
  const flaggedCount = flaggedNodes.length < root.flagged.nodes.length ? root.flaggedCount - 1 : root.flaggedCount;

  if (status === 'REJECTED') {
    acceptedNodes = root.accepted.nodes.filter((c) => c.id !== id);
    acceptedCount = acceptedNodes.length < root.accepted.nodes.length ? root.acceptedCount - 1 : root.acceptedCount;
  }
  else if (status === 'ACCEPTED') {
    rejectedNodes = root.rejected.nodes.filter((c) => c.id !== id);
    rejectedCount = rejectedNodes.length < root.rejected.nodes.length ? root.rejectedCount - 1 : root.rejectedCount;
  }

  return update(root, {
    premodCount: {$set: Math.max(0, premodCount)},
    flaggedCount: {$set: Math.max(0, flaggedCount)},
    acceptedCount: {$set: Math.max(0, acceptedCount)},
    rejectedCount: {$set: Math.max(0, rejectedCount)},
    premod: {nodes: {$set: premodNodes}},
    flagged: {nodes: {$set: flaggedNodes}},
    accepted: {nodes: {$set: acceptedNodes}},
    rejected: {nodes: {$set: rejectedNodes}},
  });
}

