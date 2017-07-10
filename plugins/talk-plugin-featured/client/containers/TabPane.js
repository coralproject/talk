import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import TabPane from '../components/TabPane';

const enhance = compose(
  withFragments({
    asset: gql`
      fragment TalkFeatured_TabPane_asset on Asset {
        recentComments {
          id
          body
          user {
            id
            username
          }
        }
      }`,
  }),
);

export default enhance(TabPane);
