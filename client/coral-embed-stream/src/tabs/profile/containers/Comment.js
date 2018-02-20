import { gql, compose } from 'react-apollo';
import Comment from '../components/Comment';
import { withFragments } from 'coral-framework/hocs';
import { getSlotFragmentSpreads } from 'coral-framework/utils';

const slots = ['commentContent', 'historyCommentTimestamp'];

const withCommentFragments = withFragments({
  comment: gql`
    fragment TalkEmbedStream_ProfileComment_comment on Comment {
      id
      body
      replyCount
      action_summaries {
        count
        __typename
      }
      asset {
        id
        title
        url
        ${getSlotFragmentSpreads(slots, 'asset')}
      }
      created_at
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `,
});

const enhance = compose(withCommentFragments);

export default enhance(Comment);
