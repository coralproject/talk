import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showSignInDialog } from 'coral-embed-stream/src/actions/login';
import SignInButton from '../components//SignInButton';

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ showSignInDialog }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);
