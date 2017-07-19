import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import TabPane from '../components/TabPane';
import {withFragments} from 'plugin-api/beta/client/hocs';
import {getSlotFragmentSpreads} from 'plugin-api/beta/client/utils';

import {viewComment} from 'coral-embed-stream/src/actions/stream';

const slots = [
  'commentReactions',
];

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
        ${getSlotFragmentSpreads(slots, 'root')}
      }
    `,
    asset: gql`
      fragment TalkFeaturedComments_TabPane_asset on Asset {
        id
        featuredComments: comments(tags: ["FEATURED"], excludeIgnored: $excludeIgnored, deep: true) {
          nodes {
            id
            body
            created_at
            replyCount
            tags {
              tag {
                name
              }
            }
            user {
              id
              username
            }
            ${getSlotFragmentSpreads(slots, 'comment')}
          }
        }
        ${getSlotFragmentSpreads(slots, 'asset')}
      }
    `,
  }),
);

export default enhance(TabPane);
