import InsiderBadge from '../components/InsiderBadge';
import {compose, gql} from 'react-apollo';
import {withFragments, excludeIf} from 'plugin-api/beta/client/hocs';

const isSubscriber = (tags = []) => tags.some((t) => t.tag.name === 'Vulture Insider');

const enhance = compose(
  withFragments({
    comment: gql`
      fragment VultureInsiderBadge_InsiderBadge_comment on Comment {
        user {
          tags {
            tag {
              name
            }
          }
        }
      }`
  }),
  excludeIf(({comment}) => !isSubscriber(comment.user.tags))
);

export default enhance(InsiderBadge);
