import {gql} from 'react-apollo';
import {withFragments} from 'plugin-api/beta/client/hocs';
import CommentMoreDetails from '../components/CommentMoreDetails';

export default withFragments({
  comment: gql`
    fragment TalkPluginCommentMoreDetails_comment on Comment {
      status_history {
        type
        assigned_by {
          username
        }
      }
    }`
})(CommentMoreDetails);
