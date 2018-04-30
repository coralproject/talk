import { compose } from 'react-apollo';
import { bindActionCreators } from 'redux';
import { connect } from 'plugin-api/beta/client/hocs';
import ChangeUsername from '../components/ChangeUsername';
import { notify } from 'coral-framework/actions/notification';
import { withSetUsername } from 'plugin-api/beta/client/hocs';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

export default compose(connect(null, mapDispatchToProps), withSetUsername)(
  ChangeUsername
);
