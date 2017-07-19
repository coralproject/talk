import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import TabPane from '../components/TabPane';
import {withFragments} from 'plugin-api/beta/client/hocs';
import FeaturedComment from '../containers/FeaturedComment';
import {getDefinitionName} from 'coral-framework/utils';

import {viewComment} from 'coral-embed-stream/src/actions/stream';

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    viewComment,
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFragments({
    root: gql`
      fragment TalkFeaturedComments_TabPane_root on RootQuery {
        __typename
        ...${getDefinitionName(FeaturedComment.fragments.root)}
      }
      ${FeaturedComment.fragments.root}
    `,
    asset: gql`
      fragment TalkFeaturedComments_TabPane_asset on Asset {
        id
        featuredComments: comments(tags: ["FEATURED"], excludeIgnored: $excludeIgnored, deep: true) {
          nodes {
            ...${getDefinitionName(FeaturedComment.fragments.comment)}
          }
          hasNextPage
          startCursor
          endCursor
        }
        ...${getDefinitionName(FeaturedComment.fragments.asset)}
      }
      ${FeaturedComment.fragments.comment}
      ${FeaturedComment.fragments.asset}
    `,
  }),
);

export default enhance(TabPane);
