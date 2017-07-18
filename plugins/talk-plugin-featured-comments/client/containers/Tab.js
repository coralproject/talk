import {compose, gql} from 'react-apollo';
import withFragments from 'coral-framework/hocs/withFragments';
import Tab from '../components/Tab';

const enhance = compose(
  withFragments({
    asset: gql`
      fragment TalkFeatured_Tab_asset on Asset {
          featuredCommentsCount: totalCommentCount(tags: ["FEATURED"], excludeIgnored: $excludeIgnored)
      }`,
  }),
);

export default enhance(Tab);
