import {graphql} from 'react-apollo';
import SET_USER_STATUS from './setUserStatus.graphql';
import SET_COMMENT_STATUS from './setCommentStatus.graphql';
import SUSPEND_USER from './suspendUser.graphql';

export const banUser = graphql(SET_USER_STATUS, {
  props: ({mutate}) => ({
    banUser: ({userId}) => {
      return mutate({
        variables: {
          userId,
          status: 'BANNED'
        },
        refetchQueries: ['Users']
      });
    }}),
});

export const setUserStatus = graphql(SET_USER_STATUS, {
  props: ({mutate}) => ({
    approveUser: ({userId}) => {
      return mutate({
        variables: {
          userId,
          status: 'APPROVED'
        },
        refetchQueries: ['Users']
      });
    }
  })
});

export const suspendUser = graphql(SUSPEND_USER, {
  props: ({mutate}) => ({
    suspendUser: ({userId, message}) => {
      return mutate({
        variables: {
          userId,
          message
        },
        refetchQueries: ['Users']
      });
    }
  })
});

const views = ['all', 'premod', 'flagged', 'accepted', 'rejected'];
export const setCommentStatus = graphql(SET_COMMENT_STATUS, {
  props: ({mutate}) => ({
    acceptComment: ({commentId}) => {
      return mutate({
        variables: {
          commentId,
          status: 'ACCEPTED'
        },
        updateQueries: {
          ModQueue: (oldData) => {
            const comment = views.reduce((comment, view) => {
              return comment ? comment : oldData[view].find((c) => c.id === commentId);
            }, null);
            let accepted;
            let acceptedCount = oldData.acceptedCount;

            // if the comment was already in the Approved queue, don't re-add it
            if (comment.status === 'ACCEPTED') {
              accepted = [...oldData.accepted];
            } else {
              comment.status = 'ACCEPTED';
              acceptedCount++;
              accepted = [comment, ...oldData.accepted];
            }

            const premod = oldData.premod.filter((c) => c.id !== commentId);
            const flagged = oldData.flagged.filter((c) => c.id !== commentId);
            const rejected = oldData.rejected.filter((c) => c.id !== commentId);
            const premodCount = premod.length < oldData.premod.length ? oldData.premodCount - 1 : oldData.premodCount;
            const flaggedCount = flagged.length < oldData.flagged.length ? oldData.flaggedCount - 1 : oldData.flaggedCount;
            const rejectedCount = rejected.length < oldData.rejected.length ? oldData.rejectedCount - 1 : oldData.rejectedCount;

            return {
              ...oldData,
              premodCount: Math.max(0, premodCount),
              flaggedCount: Math.max(0, flaggedCount),
              acceptedCount: Math.max(0, acceptedCount),
              rejectedCount: Math.max(0, rejectedCount),
              premod,
              flagged,
              accepted,
              rejected,
            };
          }
        }
      });
    },
    rejectComment: ({commentId}) => {
      return mutate({
        variables: {
          commentId,
          status: 'REJECTED'
        },
        updateQueries: {
          ModQueue: (oldData) => {
            const comment = views.reduce((comment, view) => {
              return comment ? comment : oldData[view].find((c) => c.id === commentId);
            }, null);
            let rejected;
            let rejectedCount = oldData.rejectedCount;

            // if the item was already in the Rejected queue, don't put it in again
            if (comment.status === 'REJECTED') {
              rejected = oldData.rejected;
            } else {
              comment.status = 'REJECTED';
              rejectedCount++;
              rejected = [comment, ...oldData.rejected];
            }

            const premod = oldData.premod.filter((c) => c.id !== commentId);
            const flagged = oldData.flagged.filter((c) => c.id !== commentId);
            const accepted = oldData.accepted.filter((c) => c.id !== commentId);
            const premodCount = premod.length < oldData.premod.length ? oldData.premodCount - 1 : oldData.premodCount;
            const flaggedCount = flagged.length < oldData.flagged.length ? oldData.flaggedCount - 1 : oldData.flaggedCount;
            const acceptedCount = accepted.length < oldData.accepted.length ? oldData.acceptedCount - 1 : oldData.acceptedCount;

            return {
              ...oldData,
              premodCount: Math.max(0, premodCount),
              flaggedCount: Math.max(0, flaggedCount),
              acceptedCount: Math.max(0, acceptedCount),
              rejectedCount: Math.max(0, rejectedCount),
              premod,
              flagged,
              accepted,
              rejected
            };
          }
        }
      });
    }
  })
});
