import Editor from './containers/Editor';
import CommentContent from './containers/CommentContent';
import AdminCommentContent from './containers/AdminCommentContent';
import translations from './translations.yml';

import { gql } from 'react-apollo';

export default {
  translations,
  slots: {
    draftArea: [Editor],
    commentContent: [CommentContent],
    adminCommentContent: [AdminCommentContent],
    userDetailCommentContent: [AdminCommentContent],
  },
  fragments: {
    CreateCommentResponse: gql`
      fragment TalkRichText_CreateCommentResponse on CreateCommentResponse {
        comment {
          richTextBody
        }
      }
    `,
    EditCommentResponse: gql`
      fragment TalkRichText_EditCommentResponse on EditCommentResponse {
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
            fragment TalkRichText_EditComment on Comment {
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
