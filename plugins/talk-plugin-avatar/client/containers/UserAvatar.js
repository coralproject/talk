import {gql} from 'react-apollo';
import {withFragments} from 'plugin-api/beta/client/hocs';
import UserAvatar from '../components/UserAvatar';

export default withFragments({
  comment: gql`
    fragment UserAvatar_comment on Comment {
      user {
        avatar
      }
    }`
})(UserAvatar);
