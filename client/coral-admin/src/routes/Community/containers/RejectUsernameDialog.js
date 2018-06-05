import RejectUsernameDialog from '../components/RejectUsernameDialog';
import { withRejectUsername } from 'coral-framework/graphql/mutations';
import { hideRejectUsernameDialog } from '../../../actions/community';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compose } from 'react-apollo';

const mapStateToProps = state => ({
  user: state.community.user,
  open: state.community.rejectUsernameDialog,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleClose: hideRejectUsernameDialog,
    },
    dispatch
  );

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRejectUsername
)(RejectUsernameDialog);
