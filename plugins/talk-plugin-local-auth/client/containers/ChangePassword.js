import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect } from 'plugin-api/beta/client/hocs';
import ChangePassword from '../components/ChangePassword';
import { notify } from 'coral-framework/actions/notification';
import { withChangePassword } from 'plugin-api/beta/client/hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

export default compose(connect(null, mapDispatchToProps), withChangePassword)(
  ChangePassword
);
