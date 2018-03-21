import { gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';
import CommentContent from '../components/CommentContent';

export default withFragments({
  comment: gql`
    fragment TalkPluginRichText_CommentContent_comment on Comment {
      body
      richTextBody
    }
  `,
})(CommentContent);
