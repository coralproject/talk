import { connect } from 'plugin-api/beta/client/hocs';
import { bindActionCreators } from 'redux';
import { loginWithFacebook } from '../actions';
import FacebookButton from '../components/FacebookButton';

const mapDispatchToProps = dispatch =>
  bindActionCreators({ onClick: loginWithFacebook }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(FacebookButton);
