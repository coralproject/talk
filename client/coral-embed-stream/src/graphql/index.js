import {gql} from 'react-apollo';
import {add} from 'coral-framework/services/graphqlRegistry';
import update from 'immutability-helper';
import uuid from 'uuid/v4';
import {insertCommentIntoEmbedQuery, removeCommentFromEmbedQuery} from './utils';

const extension = {
  fragments: {
    EditCommentResponse: gql`
      fragment CoralEmbedStream_EditCommentResponse on EditCommentResponse {
        comment {
          id
          status
          body
          editing {
            edited
          }
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
            nodes {
              ...CoralEmbedStream_CreateCommentResponse_Comment
            }
            startCursor
            endCursor
            hasNextPage
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
        parent {
          id
        }
      }
    `,
  },
  mutations: {
    IgnoreUser: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Embed: (previousData) => {
          const ignoredUserId = variables.id;
          const updated = update(previousData, {me: {ignoredUsers: {$push: [{
            id: ignoredUserId,
            __typename: 'User',
          }]}}});
          return updated;
        }
      }
    }),
    StopIgnoringUser: ({variables}) => ({
      updateQueries: {
        CoralEmbedStream_Profile: (previousData) => {
          const noLongerIgnoredUserId = variables.id;

          // remove noLongerIgnoredUserId from ignoredUsers
          const updated = update(previousData, {me: {ignoredUsers: {
            $apply: (ignoredUsers) => {
              return ignoredUsers.filter((u) => u.id !== noLongerIgnoredUserId);
            }
          }}});
          return updated;
        }
      }
    }),
    PostComment: ({
      variables: {comment: {asset_id, body, parent_id, tags = []}},
      state: {auth},
    }) => ({
      optimisticResponse: {
        createComment: {
          __typename: 'CreateCommentResponse',
          comment: {
            __typename: 'Comment',
            user: {
              __typename: 'User',
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
            replyCount: 0,
            parent: parent_id
              ? {id: parent_id}
              : null,
            replies: {
              __typename: 'CommentConnection',
              nodes: [],
              hasNextPage: false,
              startCursor: new Date().toISOString(),
              endCursor: new Date().toISOString(),
            },
            editing: {
              __typename: 'EditInfo',
              editableUntil: new Date().toISOString(),
              edited: false,
            },
            id: `pending-${uuid()}`,
          }
        }
      },
      updateQueries: {
        CoralEmbedStream_Embed: (prev, {mutationResult: {data: {createComment: {comment}}}}) => {
          if (prev.asset.settings.moderation === 'PRE' || comment.status === 'PREMOD' || comment.status === 'REJECTED') {
            return prev;
          }
          return insertCommentIntoEmbedQuery(prev, comment);
        },
      }
    }),
    EditComment: () => ({
      updateQueries: {
        CoralEmbedStream_Embed: (prev, {mutationResult: {data: {editComment: {comment}}}}) => {
          if (!['PREMOD', 'REJECTED'].includes(comment.status)) {
            return null;
          }
          return removeCommentFromEmbedQuery(prev, comment.id);
        },
      },
    }),
  },
};

add(extension);
