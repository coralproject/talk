import { gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';
import AdminCommentContent from '../components/AdminCommentContent';

export default withFragments({
  comment: gql`
    fragment TalkPluginRichText_AdminCommentContent_comment on Comment {
      body
      richTextBody
    }
  `,
})(AdminCommentContent);
