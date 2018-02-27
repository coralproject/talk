import { gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';
import Editor from '../components/Editor';

export default withFragments({
  comment: gql`
    fragment TalkPluginRTE_Editor_comment on Comment {
      body
      richTextBody
    }
  `,
})(Editor);
