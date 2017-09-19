import {gql} from 'react-apollo';
import CommentLabels from '../components/CommentLabels';
import withFragments from 'coral-framework/hocs/withFragments';

export default withFragments({
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
        }
      }
    }
  `
})(CommentLabels);
