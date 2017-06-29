import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import ViewingOptions from '../components/ViewingOptions';
import {openViewingOptions, closeViewingOptions} from '../actions';
import {PLUGIN_NAME, DEFAULT_CONFIG} from '../constants';

export function isEnabled(props = {}) {
  let pluginConfig = {...DEFAULT_CONFIG, ...(props.config && props.config[`${PLUGIN_NAME}`])};
  return pluginConfig.enabled;
}

const mapStateToProps = ({coralPluginViewingOptions: state}) => ({
  open: state.open
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({openViewingOptions, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewingOptions);
