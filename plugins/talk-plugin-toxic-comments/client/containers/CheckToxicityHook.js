import { bindActionCreators } from 'redux';
import { connect } from 'plugin-api/beta/client/hocs';
import { notify } from 'plugin-api/beta/client/actions/notification';
import CheckToxicityHook from '../components/CheckToxicityHook';

const mapDispatchToProps = dispatch => bindActionCreators({ notify }, dispatch);

export default connect(
  null,
  mapDispatchToProps
)(CheckToxicityHook);
