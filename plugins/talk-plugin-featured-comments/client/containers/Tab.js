import {compose, gql} from 'react-apollo';
import {withFragments, excludeIf} from 'plugin-api/beta/client/hocs';
import Tab from '../components/Tab';

const enhance = compose(
  withFragments({
    asset: gql`
      fragment TalkFeaturedComments_Tab_asset on Asset {
          featuredCommentsCount: totalCommentCount(tags: ["FEATURED"], excludeIgnored: $excludeIgnored)
      }`,
  }),
  excludeIf((props) => props.asset.featuredCommentsCount === 0),
);

export default enhance(Tab);
