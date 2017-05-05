import {gql} from 'react-apollo';
import {registerConfig} from 'coral-framework/services/registry';

const config = {
  fragments: {
    CreateCommentResponse: gql`
      fragment Coral_CreateCommentResponse on CreateCommentResponse {
        comment {
          ...Coral_CreateCommentResponse_Comment
          replies {
            ...Coral_CreateCommentResponse_Comment
          }
        }
        errors {
          translation_key
        }
      }

      fragment Coral_CreateCommentResponse_Comment on Comment {
        id
        body
        created_at
        status
        replyCount
        tags {
          name
        }
        user {
          id
          name: username
        }
        action_summaries {
          count
          current_user {
            id
            created_at
          }
        }
      }`,
  },
  mutations: {
    PostComment: ({
      variables: {comment: {asset_id, body, parent_id, tags = []}},
      state: {auth},
    }) => ({
      optimisticResponse: {
        createComment: {
          comment: {
            user: {
              id: auth.toJS().user.id,
              name: auth.toJS().user.username
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
        EmbedQuery: (oldData, {mutationResult: {data: {createComment: {comment}}}}) => {
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
                    ? {...oldComment, replies: [...oldComment.replies, comment], replyCount: oldComment.replyCount + 1}
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
  },
};

registerConfig(config);
