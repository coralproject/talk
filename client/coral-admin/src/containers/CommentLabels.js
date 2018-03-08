import { gql } from 'react-apollo';
import CommentLabels from '../components/CommentLabels';
import withFragments from 'coral-framework/hocs/withFragments';
import { getSlotFragmentSpreads } from 'coral-framework/utils';

const slots = ['adminCommentLabels'];

export default withFragments({
  root: gql`
    fragment CoralAdmin_CommentLabels_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
  `,
  comment: gql`
    fragment CoralAdmin_CommentLabels_comment on Comment {
      hasParent
      status
      actions {
        __typename
        ... on FlagAction {
          reason
        }
        user {
          id
          role
        }
        created_at
      }
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `,
})(CommentLabels);
