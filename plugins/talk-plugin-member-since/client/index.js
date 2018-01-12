import MemberSinceInfo from './containers/MemberSinceInfo';
import translations from './translations.yml';
import { gql } from 'react-apollo';

export default {
  slots: {
    authorMenuInfos: [MemberSinceInfo],
  },
  translations,
  fragments: {
    CreateCommentResponse: gql`
      fragment TalkMemberSince_CreateCommentResponse on CreateCommentResponse {
        comment {
          user {
            created_at
          }
        }
      }
    `,
  },
  mutations: {
    PostComment: () => ({
      optimisticResponse: {
        createComment: {
          comment: {
            user: {
              created_at: new Date(),
              __typename: 'User',
            },
            __typename: 'Comment',
          },
        },
      },
    }),
  },
};
