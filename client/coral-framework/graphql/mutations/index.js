import {graphql} from 'react-apollo';
import POST_COMMENT from './postComment.graphql';
import POST_FLAG from './postFlag.graphql';
import POST_LIKE from './postLike.graphql';
import POST_DONT_AGREE from './postDontAgree.graphql';
import DELETE_ACTION from './deleteAction.graphql';
import ADD_COMMENT_TAG from './addCommentTag.graphql';
import REMOVE_COMMENT_TAG from './removeCommentTag.graphql';

import commentView from '../fragments/commentView.graphql';

export const postComment = graphql(POST_COMMENT, {
  options: () => ({
    fragments: commentView
  }),
  props: ({ownProps, mutate}) => ({
    postItem: comment => {
      const {asset_id, body, parent_id, tags = []} = comment;
      console.log(tags)
      return mutate({
        variables: {
          comment
        },
        optimisticResponse: {
          createComment: {
            comment: {
              user: {
                id: ownProps.auth.user.id,
                name: ownProps.auth.user.username
              },
              created_at: new Date().toISOString(),
              body,
              parent_id,
              asset_id,
              action_summaries: [],
              tags,
              status: null,
              id: 'pending'
            }
          }
        },
        updateQueries: {
          AssetQuery: (oldData, {mutationResult: {data: {createComment: {comment}}}}) => {

            if (oldData.asset.settings.moderation === 'PRE' || comment.status === 'PREMOD' || comment.status === 'REJECTED') {
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
