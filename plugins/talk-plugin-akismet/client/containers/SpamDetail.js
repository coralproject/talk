import { compose, gql } from 'react-apollo';
import { withFragments } from 'plugin-api/beta/client/hocs';
import SpamDetail from '../components/SpamDetail';

const enhance = compose(
  withFragments({
    comment: gql`
      fragment TalkSpamComments_SpamDetail_Comment on Comment {
        spam
        actions {
          __typename
          ... on FlagAction {
            reason
          }
        }
      }
    `,
  })
);

export default enhance(SpamDetail);
