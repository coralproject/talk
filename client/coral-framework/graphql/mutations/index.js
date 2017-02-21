import {graphql} from 'react-apollo';
import POST_COMMENT from './postComment.graphql';
import POST_FLAG from './postFlag.graphql';
import POST_LIKE from './postLike.graphql';
import POST_DONT_AGREE from './postDontAgree.graphql';
import DELETE_ACTION from './deleteAction.graphql';

import commentView from '../fragments/commentView.graphql';

export const postComment = graphql(POST_COMMENT, {
  options: () => ({
    fragments: commentView
  }),
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

export const postLike = graphql(POST_LIKE, {
  props: ({mutate}) => ({
    postLike: (like) => {
      return mutate({
        variables: {
          like
        }
      });
    }}),
});

export const postFlag = graphql(POST_FLAG, {
  props: ({mutate}) => ({
    postFlag: (flag) => {
      return mutate({
        variables: {
          flag
        }
      });
    }}),
});

export const postDontAgree = graphql(POST_DONT_AGREE, {
  props: ({mutate}) => ({
    postDontAgree: (dontagree) => {
      return mutate({
        variables: {
          dontagree
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
