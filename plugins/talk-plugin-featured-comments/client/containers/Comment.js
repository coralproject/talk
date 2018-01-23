import { gql } from 'react-apollo';
import Comment from '../components/Comment';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';

const slots = ['commentReactions', 'commentAuthorName', 'commentTimestamp'];

export default withFragments({
  root: gql`
    fragment TalkFeaturedComments_Comment_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
    `,
  asset: gql`
    fragment TalkFeaturedComments_Comment_asset on Asset {
      __typename
      ${getSlotFragmentSpreads(slots, 'asset')}
    }
    `,
  comment: gql`
    fragment TalkFeaturedComments_Comment_comment on Comment {
      id
      body
      created_at
      replyCount
      tags {
        tag {
          name
        }
      }
      user {
        id
        username
      }
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `,
})(Comment);
