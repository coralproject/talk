import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import Tab from '../components/Tab';

const enhance = compose(
  withFragments({
    asset: gql`
      fragment TalkFeatured_Tab_asset on Asset {
        recentComments {
          id
        }
      }`,
  }),
);

export default enhance(Tab);
