import SubscriberBadge from '../components/SubscriberBadge';
import { compose, gql } from 'react-apollo';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';

const isSubscriber = (tags = []) => tags.some(t => t.tag.name === 'SUBSCRIBER');

const enhance = compose(
  withFragments({
    comment: gql`
      fragment TalkSubscriberBadge_SubscriberBadge_comment on Comment {
        user {
          tags {
            tag {
              name
            }
          }
        }
      }
    `,
  }),
  excludeIf(({ comment }) => !isSubscriber(comment.user.tags))
);

export default enhance(SubscriberBadge);
