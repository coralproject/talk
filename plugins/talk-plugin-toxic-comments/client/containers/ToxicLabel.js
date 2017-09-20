import {compose, gql} from 'react-apollo';
import {withFragments, excludeIf} from 'plugin-api/beta/client/hocs';
import ToxicLabel from '../components/ToxicLabel';

function isToxic(actions) {
  return actions.some((action) => action.__typename === 'FlagAction' && action.reason === 'TOXIC_COMMENT');
}

const enhance = compose(
  withFragments({
    comment: gql`
      fragment TalkToxicComments_Comment on Comment {
        actions {
          __typename
          ... on FlagAction {
            reason
          }
        }
      }`,
  }),
  excludeIf(({comment: {actions}}) => !isToxic(actions)),
);

export default enhance(ToxicLabel);
