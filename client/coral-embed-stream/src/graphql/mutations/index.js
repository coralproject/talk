import { graphql } from 'react-apollo';
import POST_COMMENT from './postComment.graphql';

export const postComment = graphql(POST_COMMENT, {
  props: ({dispatch, mutate}) => ({
    postItem: ({asset_id, body}) => {
      return mutate({
        variables: {
          asset_id,
          body,
          parent_id: null
        }
      });
    }}),
});

