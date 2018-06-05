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
import { notify } from 'coral-framework/actions/notification';
import { compose } from 'react-apollo';
import { getErrorMessages } from 'coral-framework/utils';

class RejectUsernameDialogContainer extends Component {
  rejectUsername = async ({ reason, message }) => {
    const {
      postFlag,
      rejectUsername,
      hideRejectUsernameDialog,
      userId,
    } = this.props;

    // First flag the user.
    try {
      await postFlag({
        item_id: userId,
        item_type: 'USERS',
        reason,
        message,
      });
    } catch (error) {
      // Ignore already exists error, otherwise show error.
      if (
        error.errors &&
        (error.errors.length !== 1 ||
          error.errors[0].translation_key !== 'ALREADY_EXISTS')
      ) {
        notify('error', getErrorMessages(error));
      }
    }

    await rejectUsername(userId);
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
      notify,
    },
    dispatch
  ),
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withRejectUsername,
  withPostFlag({ notifyOnError: false })
)(RejectUsernameDialogContainer);
