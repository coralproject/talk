import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {compose, gql} from 'react-apollo';
import TabPane from '../components/TabPane';
import {withFragments} from 'plugin-api/beta/client/hocs';
import {viewComment} from 'coral-embed-stream/src/actions/stream';

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    viewComment,
  }, dispatch);

const enhance = compose(
  connect(null, mapDispatchToProps),
  withFragments({
    asset: gql`
      fragment TalkFeatured_TabPane_asset on Asset {
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
            action_summaries {
              ... on LikeActionSummary {
                count
                current_user {
                  id
                }
              }
            }
            user {
              id
              username
            }
          }
        }
      }`,
  }),
);

export default enhance(TabPane);
