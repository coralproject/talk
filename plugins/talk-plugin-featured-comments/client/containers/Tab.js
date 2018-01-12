import Tab from '../components/Tab';
import { withFragments, excludeIf } from 'plugin-api/beta/client/hocs';
import { compose, gql } from 'react-apollo';
import { withProps } from 'recompose';

const enhance = compose(
  withFragments({
    asset: gql`
      fragment TalkFeaturedComments_Tab_asset on Asset {
        featuredCommentsCount: totalCommentCount(tags: ["FEATURED"])
          @skip(if: $hasComment)
      }
    `,
  }),
  excludeIf(props => props.asset.featuredCommentsCount === 0),
  withProps(props => ({
    featuredCommentsCount: props.asset.featuredCommentsCount,
  }))
);

export default enhance(Tab);
