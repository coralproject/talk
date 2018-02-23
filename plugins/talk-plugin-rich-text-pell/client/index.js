import Editor from './components/Editor';
import update from 'immutability-helper';
import CommentContent from './containers/CommentContent';
import { gql } from 'react-apollo';

export default {
  slots: {
    commentBox: [Editor],
    commentContent: [CommentContent],
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
              body
              richTextBody
            }
          `;

          const fragmentId = `Comment_${id}`;

          const data = proxy.readFragment({
            fragment: editCommentFragment,
            id: fragmentId,
          });

          const updated = update(data, {
            richTextBody: {
              $set: edit.richTextBody,
            },
          });

          proxy.writeFragment({
            fragment: editCommentFragment,
            id: fragmentId,
            data: updated,
          });
        },
      };
    },
  },
};
