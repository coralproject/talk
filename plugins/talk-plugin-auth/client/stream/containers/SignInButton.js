import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { showSignInDialog } from 'plugin-api/beta/client/actions/stream';
import SignInButton from '../components/SignInButton';
import { isLoggedInSelector } from 'plugin-api/beta/client/selectors/auth';

const mapStateToProps = state => ({
  isLoggedIn: isLoggedInSelector(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ showSignInDialog }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignInButton);
