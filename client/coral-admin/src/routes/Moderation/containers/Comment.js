import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import CommentLabels from '../../../containers/CommentLabels';
import CommentDetails from '../../../containers/CommentDetails';
import withFragments from 'coral-framework/hocs/withFragments';
import {getSlotFragmentSpreads, getDefinitionName} from 'coral-framework/utils';

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
      ...${getDefinitionName(CommentLabels.fragments.root)}
      ...${getDefinitionName(CommentDetails.fragments.root)}
    }
    ${CommentLabels.fragments.root}
    ${CommentDetails.fragments.root}
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
      editing {
        edited
      }
      hasParent
      ${getSlotFragmentSpreads(slots, 'comment')}
      ...${getDefinitionName(CommentLabels.fragments.comment)}
      ...${getDefinitionName(CommentDetails.fragments.comment)}
    }
    ${CommentLabels.fragments.comment}
    ${CommentDetails.fragments.comment}
  `
})(Comment);
