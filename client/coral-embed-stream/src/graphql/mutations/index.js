import { graphql } from 'react-apollo';
import POST_COMMENT from './postComment.graphql';

export const postComment = () =>
  graphql(POST_COMMENT, {
    props: ({mutate}) => ({
      postItem: ({asset_id, body}) => {
        mutate({
          variables: {
            asset_id,
            body,
            parent_id: null
          }
        }).then(({data}) => {
          console.log('it workt');
          console.log(data);
        });
      }}),
  });

