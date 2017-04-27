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
            const comment = oldData.all.find(c => c.id === commentId);
            comment.status = 'ACCEPTED';
            const premod = oldData.premod.filter(c => c.id !== commentId);
            const flagged = oldData.flagged.filter(c => c.id !== commentId);
            const accepted = [comment].concat(oldData.accepted);
            const rejected = oldData.rejected.filter(c => c.id !== commentId);
            const premodCount = premod.length < oldData.premod.length ? oldData.premodCount - 1 : oldData.premodCount;
            const flaggedCount = flagged.length < oldData.flagged.length ? oldData.flaggedCount - 1 : oldData.flaggedCount;
            const rejectedCount = rejected.length < oldData.rejected.length ? oldData.rejectedCount - 1 : oldData.rejectedCount;
            const acceptedCount = oldData.acceptedCount + 1;

            return {
              ...oldData,
              premodCount,
              flaggedCount,
              acceptedCount,
              rejectedCount,
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
            const comment = oldData.all.find(c => c.id === commentId);
            comment.status = 'REJECTED';
            const rejected = [comment].concat(oldData.rejected);
            const premod = oldData.premod.filter(c => c.id !== commentId);
            const flagged = oldData.flagged.filter(c => c.id !== commentId);
            const accepted = oldData.accepted.filter(c => c.id !== commentId);
            const premodCount = premod.length < oldData.premod.length ? oldData.premodCount - 1 : oldData.premodCount;
            const flaggedCount = flagged.length < oldData.flagged.length ? oldData.flaggedCount - 1 : oldData.flaggedCount;
            const rejectedCount = oldData.rejectedCount + 1;
            const acceptedCount = accepted.length < oldData.accepted.length ? oldData.acceptedCount - 1 : oldData.acceptedCount;

            return {
              ...oldData,
              premodCount,
              flaggedCount,
              acceptedCount,
              rejectedCount,
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
