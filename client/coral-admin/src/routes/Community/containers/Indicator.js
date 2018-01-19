import { compose, gql } from 'react-apollo';
import Indicator from '../../../components/Indicator';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { branch, renderNothing } from 'recompose';

const hideIfNoData = hasNoData => branch(hasNoData, renderNothing);

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkAdmin_Community_Indicator_root on RootQuery {
        flaggedUsernamesCount: userCount(
          query: {
            action_type: FLAG
            state: { status: { username: [SET, CHANGED] } }
          }
        )
      }
    `,
  }),
  hideIfNoData(props => !props.root.flaggedUsernamesCount)
);

export default enhance(Indicator);
