import { compose, gql } from 'react-apollo';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import ToxicLabel from '../components/ToxicLabel';
import { isToxic } from '../utils';

const enhance = compose(
  withFragments({
    comment: gql`
      fragment TalkToxicComments_ToxicLabel_Comment on Comment {
        actions {
          __typename
          ... on FlagAction {
            reason
          }
        }
      }
    `,
  }),
  excludeIf(({ comment: { actions } }) => !isToxic(actions))
);

export default enhance(ToxicLabel);
