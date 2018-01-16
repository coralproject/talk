import { compose, gql } from 'react-apollo';
import Tag from '../components/Tag';
import { isTagged } from 'plugin-api/beta/client/utils';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';

export default compose(
  withFragments({
    comment: gql`
      fragment TalkFeaturedComments_Tag_comment on Comment {
        tags {
          tag {
            name
          }
        }
      }
    `,
  }),
  excludeIf(props => !isTagged(props.comment.tags, 'FEATURED'))
)(Tag);
