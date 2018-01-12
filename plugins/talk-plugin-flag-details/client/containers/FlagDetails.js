import { compose, gql } from 'react-apollo';
import FlagDetails from '../components/FlagDetails';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import { getSlotFragmentSpreads } from 'plugin-api/beta/client/utils';

const slots = ['adminCommentMoreFlagDetails'];

const enhance = compose(
  withFragments({
    root: gql`
      fragment CoralAdmin_FlagDetails_root on RootQuery {
        __typename
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
    comment: gql`
      fragment CoralAdmin_FlagDetails_comment on Comment {
        actions {
          __typename
          ... on FlagAction {
            id
            reason
            message
            user {
              id
              username
            }
          }
        }
        ${getSlotFragmentSpreads(slots, 'comment')}
      }
    `,
  }),
  excludeIf(
    ({ comment: { actions } }) =>
      !actions.some(action => action.__typename === 'FlagAction')
  )
);

export default enhance(FlagDetails);
