import {gql} from 'react-apollo';
import ModTag from '../components/ModTag';
import {withFragments} from 'plugin-api/beta/client/hocs';

export default withFragments({
  comment: gql`
    fragment TalkFeaturedComments_ModTab_comment on Comment {
      tags {
        tag {
          name
        }
      }
    }
  `
})(ModTag);
