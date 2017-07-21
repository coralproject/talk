import {bindActionCreators} from 'redux';
import {showTooltip, hideTooltip} from '../actions';
import {connect} from 'plugin-api/beta/client/hocs';
import Tooltip from '../components/Tooltip';

const mapStateToProps = ({talkPluginFeaturedComments: state}) => state;

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({
    showTooltip,
    hideTooltip,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip);
