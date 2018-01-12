import { gql } from 'react-apollo';
import OffTopicTag from '../components/OffTopicTag';
import { withFragments } from 'plugin-api/beta/client/hocs';

export default withFragments({
  comment: gql`
    fragment TalkOfftopic_OffTopicTag_comment on Comment {
      tags {
        tag {
          name
        }
      }
    }
  `,
})(OffTopicTag);
