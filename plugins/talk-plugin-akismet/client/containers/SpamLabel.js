import { compose, gql } from 'react-apollo';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import SpamLabel from '../components/SpamLabel';
import { isSpam } from '../utils';

const enhance = compose(
  withFragments({
    comment: gql`
      fragment TalkSpamComments_SpamLabel_Comment on Comment {
        actions {
          __typename
          ... on FlagAction {
            reason
          }
        }
      }
    `,
  }),
  excludeIf(({ comment: { actions } }) => !isSpam(actions))
);

export default enhance(SpamLabel);
