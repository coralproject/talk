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
        refetchQueries: ['ModQueue']
      });
    },
    rejectComment: ({commentId}) => {
      return mutate({
        variables: {
          commentId,
          status: 'REJECTED'
        },
        refetchQueries: ['ModQueue']
      });
    }
  })
});
