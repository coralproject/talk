import {graphql, gql} from 'react-apollo';
import POST_FLAG from './postFlag.graphql';
import POST_LIKE from './postLike.graphql';
import POST_DONT_AGREE from './postDontAgree.graphql';
import DELETE_ACTION from './deleteAction.graphql';
import ADD_COMMENT_TAG from './addCommentTag.graphql';
import REMOVE_COMMENT_TAG from './removeCommentTag.graphql';
import IGNORE_USER from './ignoreUser.graphql';
import STOP_IGNORING_USER from './stopIgnoringUser.graphql';
import withMutation from '../../hocs/withMutation';
import {getFragmentDocument} from '../../services/registry';

export const withPostComment = withMutation(
  gql`
    mutation PostComment($comment: CreateCommentInput!) {
      createComment(comment: $comment) {
        ...CreateCommentResponse
      }
    }
    ${getFragmentDocument('CreateCommentResponse')}
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

export const addCommentTag = graphql(ADD_COMMENT_TAG, {
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
