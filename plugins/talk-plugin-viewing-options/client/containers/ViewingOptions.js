import {connect} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import ViewingOptions from '../components/ViewingOptions';
import {openViewingOptions, closeViewingOptions} from '../actions';

const mapStateToProps = ({coralPluginViewingOptions: state}) => ({
  open: state.open
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({openViewingOptions, closeViewingOptions}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewingOptions);
