import Editor from './containers/Editor';
import CommentContent from './containers/CommentContent';
import { gql } from 'react-apollo';

export default {
  slots: {
    draftArea: [Editor],
    commentContent: [CommentContent],
    adminCommentContent: [CommentContent],
    userDetailCommentContent: [CommentContent],
  },
  fragments: {
    CreateCommentResponse: gql`
      fragment TalkRTE_CreateCommentResponse on CreateCommentResponse {
        comment {
          richTextBody
        }
      }
    `,
    EditCommentResponse: gql`
      fragment TalkRTE_EditCommentResponse on EditCommentResponse {
        comment {
          richTextBody
        }
      }
    `,
  },
  mutations: {
    PostComment: ({ variables: { input } }) => {
      return {
        optimisticResponse: {
          createComment: {
            comment: {
              richTextBody: input.richTextBody,
            },
          },
        },
      };
    },
    EditComment: ({ variables: { id, edit } }) => {
      return {
        optimisticResponse: {
          editComment: {
            comment: {
              richTextBody: edit.richTextBody,
            },
          },
        },
        update: proxy => {
          const editCommentFragment = gql`
            fragment Talk_EditComment on Comment {
              richTextBody
            }
          `;

          const fragmentId = `Comment_${id}`;

          proxy.writeFragment({
            fragment: editCommentFragment,
            id: fragmentId,
            data: {
              __typename: 'Comment',
              richTextBody: edit.richTextBody,
            },
          });
        },
      };
    },
  },
};
