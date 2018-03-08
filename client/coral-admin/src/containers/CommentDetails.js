import { gql } from 'react-apollo';
import CommentDetails from '../components/CommentDetails';
import { getSlotFragmentSpreads } from 'coral-framework/utils';
import withFragments from 'coral-framework/hocs/withFragments';

const slots = ['adminCommentDetailArea', 'adminCommentMoreDetails'];

export default withFragments({
  root: gql`
    fragment CoralAdmin_CommentDetails_root on RootQuery {
      __typename
      ${getSlotFragmentSpreads(slots, 'root')}
    }
  `,
  comment: gql`
    fragment CoralAdmin_CommentDetails_comment on Comment {
      __typename
      ${getSlotFragmentSpreads(slots, 'comment')}
    }
  `,
})(CommentDetails);
