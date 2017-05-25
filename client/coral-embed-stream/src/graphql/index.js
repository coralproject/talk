import {gql} from 'react-apollo';
import {add} from 'coral-framework/services/graphqlRegistry';
import update from 'immutability-helper';

const extension = {
  fragments: {
    EditCommentResponse: gql`
      fragment CoralEmbedStream_EditCommentResponse on EditCommentResponse {
        comment {
          status
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
      }
    `,
    CreateFlagResponse: gql`
      fragment CoralEmbedStream_CreateFlagResponse on CreateFlagResponse {
        flag {
          id
        }
      }
    `,
    CreateDontAgreeResponse : gql`
      fragment CoralEmbedStream_CreateDontAgreeResponse on CreateDontAgreeResponse {
        dontagree {
          id
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
    IgnoreUser: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Embed: (previousData, {mutationResult}) => {
          const ignoredUserId = variables.id;
          const response = mutationResult.data.ignoreUser;
          if (ignoredUserId && !response.errors) {
            const updated = update(previousData, {me: {ignoredUsers: {$push: [{
              id: ignoredUserId,
              __typename: 'User',
            }]}}});
            return updated;
          }
          return previousData;
        }
      }
    }),
    StopIgnoringUser: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Profile: (previousData, {mutationResult}) => {
          const noLongerIgnoredUserId = variables.id;
          const response = mutationResult.data.stopIgnoringUser;
          if (noLongerIgnoredUserId && !response.errors) {

            // remove noLongerIgnoredUserId from ignoredUsers
            const updated = update(previousData, {me: {ignoredUsers: {
              $apply: (ignoredUsers) => {
                return ignoredUsers.filter((u) => u.id !== noLongerIgnoredUserId);
              }
            }}});
            return updated;
          }
          return previousData;
        }
      }
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
        CoralEmbedStream_Embed: (previousData, {mutationResult: {data: {createComment: {comment}}}}) => {
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
        CoralEmbedStream_Embed: (previousData, {mutationResult: {data: {editComment: {comment, errors}}}}) => {

          // @TODO (kiwi) revisit after streamlining error handling
          if (errors && errors.length) {
            return previousData;
          }
          const {status} = comment;
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
            return !((id === comment.id) && (['PREMOD', 'REJECTED'].includes(status)));
          };
          const resultReflectingEdit = update(previousData, {
            asset: {
              comments: {
                $apply: (comments) => {
                  return comments.filter(commentIsStillVisible).map((comment) => {
                    let replyWasEditedToBeHidden = false;
                    if (comment.id === id) {
                      return updateCommentWithEdit(comment, edit);
                    }
                    const commentWithUpdatedReplies = update(comment, {
                      replies: {
                        $apply: (comments) => {
                          return comments
                            .filter((c) => {
                              if (commentIsStillVisible(c)) {
                                return true;
                              }
                              replyWasEditedToBeHidden = true;
                              return false;
                            })
                            .map((comment) => {
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

add(extension);
