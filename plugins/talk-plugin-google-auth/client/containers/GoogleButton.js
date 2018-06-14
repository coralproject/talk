import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { loginWithGoogle } from '../actions';
import GoogleButton from '../components/GoogleButton';

const mapDispatchToProps = dispatch =>
  bindActionCreators({ onClick: loginWithGoogle }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(GoogleButton);
