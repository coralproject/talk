import {graphql} from 'react-apollo';
import MY_COMMENT_HISTORY from './myCommentHistory.graphql';
import MY_IGNORED_USERS from './myIgnoredUsers.graphql';

export const myCommentHistory = graphql(MY_COMMENT_HISTORY, {});

export const myIgnoredUsers = graphql(MY_IGNORED_USERS, {
  props: ({data}) => {
    return ({
      myIgnoredUsersData: data
    });
  }
});
