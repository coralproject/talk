import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import RejectUsernameDialog from '../components/RejectUsernameDialog';
import { hideRejectUsernameDialog } from '../actions/rejectUsernameDialog';
import {
  withRejectUsername,
  withPostFlag,
} from 'coral-framework/graphql/mutations';
import { compose } from 'react-apollo';

class RejectUsernameDialogContainer extends Component {
  rejectUsername = async ({ reason, message }) => {
    const {
      postFlag,
      rejectUsername,
      hideRejectUsernameDialog,
      userId,
    } = this.props;

    await postFlag({
      item_id: userId,
      item_type: 'USERS',
      reason,
      message,
    });

    await rejectUsername({ id: userId });
    hideRejectUsernameDialog();
  };

  render() {
    return (
      <RejectUsernameDialog
        open={this.props.open}
        onPerform={this.rejectUsername}
        onCancel={this.props.hideRejectUsernameDialog}
        username={this.props.username}
      />
    );
  }
}

RejectUsernameDialogContainer.propTypes = {
  rejectUsername: PropTypes.func.isRequired,
  hideRejectUsernameDialog: PropTypes.func,
  open: PropTypes.bool,
  userId: PropTypes.string,
  username: PropTypes.string,
};

const mapStateToProps = ({
  rejectUsernameDialog: { open, userId, username },
}) => ({
  open,
  userId,
  username,
});

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      hideRejectUsernameDialog,
    },
    dispatch
  ),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withRejectUsername,
  withPostFlag
)(RejectUsernameDialogContainer);
