import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout } from 'plugin-api/beta/client/actions/auth';
import UserBox from '../components/UserBox';
import { usernameSelector } from 'plugin-api/beta/client/selectors/auth';

const mapStateToProps = state => ({
  username: usernameSelector(state),
});

const mapDispatchToProps = dispatch => bindActionCreators({ logout }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserBox);
