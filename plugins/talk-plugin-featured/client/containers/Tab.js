import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import excludeIf from 'coral-framework/hocs/excludeIf';
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
  excludeIf((props) => props.asset.recentComments.length === 0)
);

export default enhance(Tab);
