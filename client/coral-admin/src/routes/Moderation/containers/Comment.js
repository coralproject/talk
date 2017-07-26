import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import withFragments from 'coral-framework/hocs/withFragments';
import {getSlotFragmentSpreads} from 'coral-framework/utils';

const slots = [
  'adminCommentInfoBar',
  'adminCommentContent',
  'adminSideActions',
  'adminCommentDetailArea',
];

export default withFragments({
  root: gql`
    fragment CoralAdmin_ModerationComment_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
    `,
  comment: gql`
    fragment CoralAdmin_ModerationComment_comment on Comment {
      id
      body
      created_at
      status
      user {
        id
        username
        status
      }
      asset {
        id
        title
        url
      }
      action_summaries {
        count
        ... on FlagActionSummary {
          reason
        }
      }
      actions {
        ... on FlagAction {
          id
          reason
          message
          user {
            id
            username
          }
        }
      }
      editing {
        edited
      }
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `
})(Comment);
