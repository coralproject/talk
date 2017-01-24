import {graphql} from 'react-apollo';
import POST_COMMENT from './postComment.graphql';
import POST_ACTION from './postAction.graphql';
import DELETE_ACTION from './deleteAction.graphql';

export const postComment = graphql(POST_COMMENT, {
  props: ({mutate}) => ({
    postItem: ({asset_id, body, parent_id} /* , type */ ) => {
      return mutate({
        variables: {
          asset_id,
          body,
          parent_id
        }
      });
    }}),
});

export const postAction = graphql(POST_ACTION, {
  props: ({mutate}) => ({
    postAction: (action) => {
      return mutate({
        variables: {
          action
        }
      });
    }}),
});

export const deleteAction = graphql(DELETE_ACTION, {
  props: ({mutate}) => ({
    deleteAction: (id) => {
      return mutate({
        variables: {
          id
        }
      });
    }}),
});
