import { gql } from 'react-apollo';
import UserDetailComment from '../components/UserDetailComment';
import withFragments from 'coral-framework/hocs/withFragments';
import { getDefinitionName } from 'coral-framework/utils';
import CommentLabels from './CommentLabels';
import CommentDetails from './CommentDetails';

export default withFragments({
  root: gql`
    fragment CoralAdmin_UserDetailComment_root on RootQuery {
      settings {
        wordlist {
          banned
          suspect
        }
      }
      ...${getDefinitionName(CommentLabels.fragments.root)}
      ...${getDefinitionName(CommentDetails.fragments.root)}
    }
    ${CommentLabels.fragments.root}
    ${CommentDetails.fragments.root}
  `,
  comment: gql`
    fragment CoralAdmin_UserDetailComment_comment on Comment {
      id
      body
      created_at
      status
      hasParent
      asset {
        id
        title
        url
      }
      editing {
        edited
      }
      status_history {
        type
      }
      ...${getDefinitionName(CommentLabels.fragments.comment)}
      ...${getDefinitionName(CommentDetails.fragments.comment)}
    }
    ${CommentLabels.fragments.comment}
    ${CommentDetails.fragments.comment}
  `,
})(UserDetailComment);
