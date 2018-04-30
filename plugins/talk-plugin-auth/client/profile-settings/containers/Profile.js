import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect } from 'plugin-api/beta/client/hocs';
import Profile from '../components/Profile';
import { notify } from 'coral-framework/actions/notification';
import {
  withChangeUsername,
  withUpdateEmailAddress,
} from 'plugin-api/beta/client/hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

export default compose(
  connect(null, mapDispatchToProps),
  withChangeUsername,
  withUpdateEmailAddress
)(Profile);
