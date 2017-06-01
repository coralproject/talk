import {add} from 'coral-framework/services/graphqlRegistry';
import update from 'immutability-helper';
const queues = ['all', 'premod', 'flagged', 'accepted', 'rejected'];

const extension = {
  mutations: {
    SetUserStatus: () => ({
      refetchQueries: ['CoralAdmin_Community'],
    }),
    RejectUsername: () => ({
      refetchQueries: ['CoralAdmin_Community'],
    }),
    SetCommentStatus: ({variables: {commentId, status}}) => ({
      updateQueries: {
        CoralAdmin_Moderation: (prev) => {
          const comment = queues.reduce((comment, queue) => {
            return comment ? comment : prev[queue].nodes.find((c) => c.id === commentId);
          }, null);

          let acceptedNodes = prev.accepted.nodes;
          let acceptedCount = prev.acceptedCount;
          let rejectedNodes = prev.rejected.nodes;
          let rejectedCount = prev.rejectedCount;

          if (status !== comment.status) {
            if (status === 'ACCEPTED') {
              comment.status = 'ACCEPTED';
              acceptedCount++;
              acceptedNodes = [comment, ...acceptedNodes];
            }
            else if (status === 'REJECTED') {
              comment.status = 'REJECTED';
              rejectedCount++;
              rejectedNodes = [comment, ...rejectedNodes];
            }
          }

          const premodNodes = prev.premod.nodes.filter((c) => c.id !== commentId);
          const flaggedNodes = prev.flagged.nodes.filter((c) => c.id !== commentId);
          const premodCount = premodNodes.length < prev.premod.nodes.length ? prev.premodCount - 1 : prev.premodCount;
          const flaggedCount = flaggedNodes.length < prev.flagged.nodes.length ? prev.flaggedCount - 1 : prev.flaggedCount;

          if (status === 'REJECTED') {
            acceptedNodes = prev.accepted.nodes.filter((c) => c.id !== commentId);
            acceptedCount = acceptedNodes.length < prev.accepted.nodes.length ? prev.acceptedCount - 1 : prev.acceptedCount;
          }
          else if (status === 'ACCEPTED') {
            rejectedNodes = prev.rejected.nodes.filter((c) => c.id !== commentId);
            rejectedCount = rejectedNodes.length < prev.rejected.nodes.length ? prev.rejectedCount - 1 : prev.rejectedCount;
          }

          return update(prev, {
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
      }
    }),
  },
};

add(extension);
