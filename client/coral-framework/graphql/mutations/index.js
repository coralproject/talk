import {graphql} from 'react-apollo';
import POST_COMMENT from './postComment.graphql';
import POST_FLAG from './postFlag.graphql';
import POST_LIKE from './postLike.graphql';
import DELETE_ACTION from './deleteAction.graphql';

import commentView from '../fragments/commentView.graphql';

export const postComment = graphql(POST_COMMENT, {
  options: () => ({
    fragments: commentView
  }),
  props: ({ownProps, mutate}) => ({
    postItem: ({asset_id, body, parent_id}) =>
      mutate({
        variables: {
          asset_id,
          body,
          parent_id
        },
        optimisticResponse: {
          createComment: {
            comment: {
              user: {
                id: ownProps.auth.user.id,
                name: ownProps.auth.user.username
              },
              created_at: new Date().toString(),
              body,
              parent_id,
              asset_id,
              action_summaries: [],
              tags: [],
              status: null,
              id: `${Date.now()}_temp_id`
            }
          }
        },
        updateQueries: {
          AssetQuery: (oldData, {mutationResult:{data:{createComment:{comment}}}}) => {

            if (oldData.asset.moderation === 'PRE') {
              return oldData;
            }

            let updatedAsset;

            // If posting a reply
            if (parent_id) {
              updatedAsset = {
                ...oldData,
                asset: {
                  ...oldData.asset,
                  comments: oldData.asset.comments.map((oldComment) => {
                    return oldComment.id === parent_id
                    ? {...oldComment, replies: [...oldComment.replies, comment]}
                    : oldComment;
                  })
                }
              };
            } else {

              // If posting a top-level comment
              updatedAsset = {
                ...oldData,
                asset: {
                  ...oldData.asset,
                  commentCount: oldData.asset.commentCount + 1,
                  comments: [comment, ...oldData.asset.comments]
                }
              };
            }

            return updatedAsset;
          }
        }
      })
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
