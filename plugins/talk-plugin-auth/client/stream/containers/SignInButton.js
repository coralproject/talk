import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showSignInDialog } from 'plugin-api/beta/client/actions/stream';
import SignInButton from '../components/SignInButton';

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.user,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ showSignInDialog }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SignInButton);
