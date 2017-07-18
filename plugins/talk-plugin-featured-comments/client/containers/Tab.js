import {compose, gql} from 'react-apollo';
import {withFragments} from 'plugin-api/beta/client/hocs';
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
