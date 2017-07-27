import {connect} from 'plugin-api/beta/client/hocs';
import {bindActionCreators} from 'redux';
import ViewingOptions from '../components/ViewingOptions';
import {openMenu, closeMenu} from '../actions';

const mapStateToProps = ({talkPluginViewingOptions: state}) => ({
  open: state.open
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({openMenu, closeMenu}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ViewingOptions);
