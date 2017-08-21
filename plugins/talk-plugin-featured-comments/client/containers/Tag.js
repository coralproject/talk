import {gql} from 'react-apollo';
import Tag from '../components/Tag';
import {withFragments} from 'plugin-api/beta/client/hocs';

export default withFragments({
  comment: gql`
    fragment TalkFeaturedComments_Tag_comment on Comment {
      tags {
        tag {
          name
        }
      }
    }
  `
})(Tag);
