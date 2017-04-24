import {gql} from 'react-apollo';
import Comment from '../components/Comment';
import withFragments from 'coral-framework/hocs/withFragments';

export default withFragments({
  comment: gql`
    fragment Comment_comment on Comment {
      id
      body
      created_at
      status
      tags {
        name
      }
      user {
        id
        name: username
      }
      action_summaries {
        __typename
        count
        current_user {
          id
          created_at
        }
      }
    }`,
})(Comment);
