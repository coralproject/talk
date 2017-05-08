import {gql} from 'react-apollo';
import {registerConfig} from 'coral-framework/services/registry';

const config = {
  fragments: {
    StopIgnoringUserResponse: gql`
      fragment CoralEmbedStream_StopIgnoringUserResponse on StopIgnoringUserResponse {
        errors {
          translation_key
        }
      }
    `,
    IgnoreUserResponse: gql`
      fragment CoralEmbedStream_IgnoreUserResponse on IgnoreUserResponse {
        errors {
          translation_key
        }
      }
    `,
    RemoveCommentTagResponse: gql`
      fragment CoralEmbedStream_RemoveCommentTagResponse on RemoveCommentTagResponse {
        comment {
          id
          tags {
            name
          }
        }
        errors {
          translation_key
        }
      }
    `,
    AddCommentTagResponse: gql`
      fragment CoralEmbedStream_AddCommentTagResponse on AddCommentTagResponse {
        comment {
          id
          tags {
            name
          }
        }
        errors {
          translation_key
        }
      }
    `,
    DeleteActionResponse: gql`
      fragment CoralEmbedStream_DeleteActionResponse on DeleteActionResponse {
        errors {
          translation_key
        }
      }
    `,
    CreateFlagResponse: gql`
      fragment CoralEmbedStream_CreateFlagResponse on CreateFlagResponse {
        flag {
          id
        }
        errors {
          translation_key
        }
      }
    `,
    CreateDontAgreeResponse : gql`
      fragment CoralEmbedStream_CreateDontAgreeResponse on CreateDontAgreeResponse {
        dontagree {
          id
        }
        errors {
          translation_key
        }
      }
    `,
    CreateCommentResponse: gql`
      fragment CoralEmbedStream_CreateCommentResponse on CreateCommentResponse {
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

      fragment CoralEmbedStream_CreateCommentResponse_Comment on Comment {
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
      }
    `,
  },
  mutations: {
    IgnoreUser: () => ({

      // TODO: don't rely on refetching.
      refetchQueries: [
        'EmbedQuery', 'myIgnoredUsers',
      ],
    }),
    StopIgnoringUser: () => ({

      // TODO: don't rely on refetching.
      refetchQueries: [
        'EmbedQuery', 'myIgnoredUsers',
      ],
    }),
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
