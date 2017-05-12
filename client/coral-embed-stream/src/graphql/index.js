import {gql} from 'react-apollo';
import {registerConfig} from 'coral-framework/services/registry';
import update from 'immutability-helper';

const config = {
  fragments: {
    EditCommentResponse: gql`
      fragment CoralEmbedStream_EditCommentResponse on EditCommentResponse {
        comment {
          status
        }
        errors {
          translation_key
        }
      }
    `,
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
          ...CoralEmbedStream_CreateCommentResponse_Comment
          replies {
            ...CoralEmbedStream_CreateCommentResponse_Comment
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
        editing {
          edited
          editableUntil
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
        EmbedQuery: (previousData, {mutationResult: {data: {createComment: {comment}}}}) => {
          if (previousData.asset.settings.moderation === 'PRE' || comment.status === 'PREMOD' || comment.status === 'REJECTED') {
            return previousData;
          }

          let updatedAsset;

          // If posting a reply
          if (parent_id) {
            updatedAsset = {
              ...previousData,
              asset: {
                ...previousData.asset,
                comments: previousData.asset.comments.map((oldComment) => {
                  return oldComment.id === parent_id
                    ? {...oldComment, replies: [...oldComment.replies, comment], replyCount: oldComment.replyCount + 1}
                    : oldComment;
                })
              }
            };
          } else {

            // If posting a top-level comment
            updatedAsset = {
              ...previousData,
              asset: {
                ...previousData.asset,
                commentCount: previousData.asset.commentCount + 1,
                comments: [comment, ...previousData.asset.comments]
              }
            };
          }

          return updatedAsset;
        }
      }
    }),
    EditComment: ({
      variables: {id, edit},
    }) => ({
      updateQueries: {
        EmbedQuery: (previousData, {mutationResult: {data: {editComment: {comment: {status}}}}}) => {
          const updateCommentWithEdit = (comment, edit) => {
            const {body} = edit;
            const editedComment = update(comment, {
              $merge: {
                body
              },
              editing: {$merge:{edited:true}}
            });
            return editedComment;
          };
          const commentIsStillVisible = (comment) => {
            return ! ((id === comment.id) && (['PREMOD', 'REJECTED'].includes(status)));
          };
          const resultReflectingEdit = update(previousData, {
            asset: {
              comments: {
                $apply: comments => {
                  return comments.filter(commentIsStillVisible).map(comment => {
                    let replyWasEditedToBeHidden = false;
                    if (comment.id === id) {
                      return updateCommentWithEdit(comment, edit);
                    }
                    const commentWithUpdatedReplies = update(comment, {
                      replies: {
                        $apply: (comments) => {
                          return comments
                            .filter(c => {
                              if (commentIsStillVisible(c)) {
                                return true;
                              }
                              replyWasEditedToBeHidden = true;
                              return false;
                            })
                            .map(comment => {
                              if (comment.id === id) {
                                return updateCommentWithEdit(comment, edit);
                              }
                              return comment;
                            });
                        }
                      },
                    });

                    // If a reply was edited to be hdiden, then this parent needs its replyCount to be decremented.
                    if (replyWasEditedToBeHidden) {
                      return update(commentWithUpdatedReplies, {
                        replyCount: {
                          $apply: (replyCount) => {
                            return replyCount - 1;
                          }
                        }
                      });
                    }
                    return commentWithUpdatedReplies;
                  });
                }
              }
            }
          });
          return resultReflectingEdit;
        },
      },
    }),
  },
};

registerConfig(config);
