import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import Tab from '../components/Tab';

// TODO: This is just example code, and needs to replaced by an actual implementation.
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
