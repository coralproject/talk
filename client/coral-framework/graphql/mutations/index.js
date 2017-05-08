import {graphql, gql} from 'react-apollo';
import REMOVE_COMMENT_TAG from './removeCommentTag.graphql';
import IGNORE_USER from './ignoreUser.graphql';
import STOP_IGNORING_USER from './stopIgnoringUser.graphql';
import withMutation from '../../hocs/withMutation';

export const withPostComment = withMutation(
  gql`
    mutation PostComment($comment: CreateCommentInput!) {
      createComment(comment: $comment) {
        ...CreateCommentResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      postComment: comment => {
        return mutate({
          variables: {
            comment
          },
        });
      }
    }),
  });

export const withPostFlag = withMutation(
  gql`
    mutation PostFlag($flag: CreateFlagInput!) {
      createFlag(flag: $flag) {
        ...CreateFlagResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      postFlag: (flag) => {
        return mutate({
          variables: {
            flag
          }
        });
      }}),
  });

export const withPostDontAgree = withMutation(
  gql`
    mutation CreateDontAgree($dontagree: CreateDontAgreeInput!) {
      createDontAgree(dontagree: $dontagree) {
        ...CreateDontAgreeResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      postDontAgree: (dontagree) => {
        return mutate({
          variables: {
            dontagree
          }
        });
      }}),
  });

export const withDeleteAction = withMutation(
  gql`
    mutation DeleteAction($id: ID!) {
      deleteAction(id:$id) {
        ...DeleteActionResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      deleteAction: (id) => {
        return mutate({
          variables: {
            id
          }
        });
      }}),
  });

export const withAddCommentTag = withMutation(
  gql`
    mutation AddCommentTag($id: ID!, $tag: String!) {
      addCommentTag(id:$id, tag:$tag) {
        ...AddCommentTagResponse
      }
    }
  `, {
    props: ({mutate}) => ({
      addCommentTag: ({id, tag}) => {
        return mutate({
          variables: {
            id,
            tag
          }
        });
      }}),
  });

export const removeCommentTag = graphql(REMOVE_COMMENT_TAG, {
  props: ({mutate}) => ({
    removeCommentTag: ({id, tag}) => {
      return mutate({
        variables: {
          id,
          tag
        }
      });
    }}),
});

// TODO: don't rely on refetching.
export const ignoreUser = graphql(IGNORE_USER, {
  props: ({mutate}) => ({
    ignoreUser: ({id}) => {
      return mutate({
        variables: {
          id,
        },
        refetchQueries: [
          'EmbedQuery', 'myIgnoredUsers',
        ]
      });
    }}),
});

// TODO: don't rely on refetching.
export const stopIgnoringUser = graphql(STOP_IGNORING_USER, {
  props: ({mutate}) => {
    return {
      stopIgnoringUser: ({id}) => {
        return mutate({
          variables: {
            id,
          },
          refetchQueries: [
            'EmbedQuery', 'myIgnoredUsers',
          ]
        });
      }
    };
  }
});
