import {gql} from 'react-apollo';
import UserDetailComment from '../components/UserDetailComment';
import withFragments from 'coral-framework/hocs/withFragments';

export default withFragments({
  comment: gql`
    fragment CoralAdmin_UserDetail_comment on Comment {
      id
      body
      created_at
      status
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
    }
  `
})(UserDetailComment);
