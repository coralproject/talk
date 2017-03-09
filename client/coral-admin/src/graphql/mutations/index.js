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
    suspendUser: ({userId}) => {
      return mutate({
        variables: {
          userId
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
            const premod = oldData.premod.filter(c => c.id !== commentId);
            const flagged = oldData.flagged.filter(c => c.id !== commentId);
            const rejected = oldData.rejected.filter(c => c.id !== commentId);
            const premodCount = premod.length < oldData.premod.length ? oldData.premodCount - 1 : oldData.premodCount;
            const flaggedCount = flagged.length < oldData.flagged.length ? oldData.flaggedCount - 1 : oldData.flaggedCount;
            const rejectedCount = rejected.length < oldData.rejected.length ? oldData.rejectedCount - 1 : oldData.rejectedCount;

            return {
              ...oldData,
              premodCount,
              flaggedCount,
              rejectedCount,
              premod,
              flagged,
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
            const comment = oldData.premod.concat(oldData.flagged).filter(c => c.id === commentId)[0];
            const rejected = [comment].concat(oldData.rejected);
            const premod = oldData.premod.filter(c => c.id !== commentId);
            const flagged = oldData.flagged.filter(c => c.id !== commentId);
            const premodCount = premod.length < oldData.premod.length ? oldData.premodCount - 1 : oldData.premodCount;
            const flaggedCount = flagged.length < oldData.flagged.length ? oldData.flaggedCount - 1 : oldData.flaggedCount;
            const rejectedCount = oldData.rejectedCount + 1;

            return {
              ...oldData,
              premodCount,
              flaggedCount,
              rejectedCount,
              premod,
              flagged,
              rejected
            };
          }
        }
      });
    }
  })
});
