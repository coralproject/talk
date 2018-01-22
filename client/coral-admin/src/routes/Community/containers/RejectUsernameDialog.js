import RejectUsernameDialog from '../components/RejectUsernameDialog';
import { withRejectUsername } from 'coral-framework/graphql/mutations';
import { hideRejectUsernameDialog } from '../../../actions/community';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';
import { notify } from 'coral-framework/actions/notification';
import { notifyOnMutationError } from 'coral-framework/hocs';

const mapStateToProps = state => ({
  user: state.community.user,
  open: state.community.rejectUsernameDialog,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleClose: hideRejectUsernameDialog,
      notify,
    },
    dispatch
  );

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRejectUsername,
  notifyOnMutationError(['rejectUsername'])
)(RejectUsernameDialog);
