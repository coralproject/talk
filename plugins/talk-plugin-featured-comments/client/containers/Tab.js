import Tab from '../components/Tab';
import {bindActionCreators} from 'redux';
import {showTooltip, hideTooltip} from '../actions';
import {compose, gql} from 'react-apollo';
import {withFragments, excludeIf, connect} from 'plugin-api/beta/client/hocs';

const mapStateToProps = ({talkPluginFeaturedComments: state}) => state;

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showTooltip,
    hideTooltip,
  }, dispatch);

const enhance = compose(
  connect(mapStateToProps, mapDispatchToProps),
  withFragments({
    asset: gql`
      fragment TalkFeaturedComments_Tab_asset on Asset {
          featuredCommentsCount: totalCommentCount(tags: ["FEATURED"]) @skip(if: $hasComment)
      }`,
  }),
  excludeIf((props) => props.asset.featuredCommentsCount === 0),
);

export default enhance(Tab);
