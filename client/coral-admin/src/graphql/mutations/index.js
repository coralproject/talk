// acceptComment
// rejectComment
import {graphql} from 'react-apollo';
import SET_USER_STATUS from './setUserStatus.graphql';

export const banUser = graphql(SET_USER_STATUS, {
  props: ({mutate}) => ({
    banUser: ({userId}) => {
      return mutate({
        variables: {
          userId,
          status: 'BANNED'
        }
      });
    }}),
});
