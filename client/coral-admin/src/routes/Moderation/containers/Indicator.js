import { compose, gql } from 'react-apollo';
import Indicator from '../../../components/Indicator';
import { withFragments } from 'plugin-api/beta/client/hocs';
import { branch, renderNothing } from 'recompose';

const hideIfNoData = hasNoData => branch(hasNoData, renderNothing);

const enhance = compose(
  withFragments({
    root: gql`
      fragment TalkAdmin_Moderation_Indicator_root on RootQuery {
        premodCount: commentCount(query: { statuses: [PREMOD] })
        reportedCount: commentCount(
          query: {
            statuses: [NONE, PREMOD, SYSTEM_WITHHELD]
            action_type: FLAG
          }
        )
      }
    `,
  }),
  hideIfNoData(props => !props.root.premodCount && !props.root.reportedCount)
);

export default enhance(Indicator);
