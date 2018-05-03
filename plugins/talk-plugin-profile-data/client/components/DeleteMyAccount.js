import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import styles from './DeleteMyAccount.css';
import { Button } from 'plugin-api/beta/client/components/ui';
import DeleteMyAccountDialog from './DeleteMyAccountDialog';
import { getErrorMessages } from 'coral-framework/utils';

const initialState = { showDialog: false };

class DeleteMyAccount extends React.Component {
  state = initialState;

  showDialog = () => {
    this.setState({
      showDialog: true,
    });
  };

  closeDialog = () => {
    this.setState({
      showDialog: false,
    });
  };

  cancelAccountDeletion = async () => {
    const { cancelAccountDeletion, notify } = this.props;
    try {
      await cancelAccountDeletion();
      notify(
        'success',
        'Account Deletion Request Cancelled - Your request to delete your account has been cancelled. You may now write comments, reply to comments, and select reactions.'
      );
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  requestAccountDeletion = async () => {
    const { requestAccountDeletion, notify } = this.props;
    try {
      await requestAccountDeletion();
      notify('success', 'Account Deletion Requested');
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  render() {
    const {
      me: { scheduledDeletionDate },
      settings: { organizationContactEmail },
    } = this.props.root;
    return (
      <div className="talk-plugin-auth--delete-my-account">
        <DeleteMyAccountDialog
          requestAccountDeletion={this.requestAccountDeletion}
          showDialog={this.state.showDialog}
          closeDialog={this.closeDialog}
          scheduledDeletionDate={scheduledDeletionDate}
          organizationContactEmail={organizationContactEmail}
        />
        <h3
          className={cn(
            styles.title,
            'talk-plugin-auth--delete-my-account-description'
          )}
        >
          Delete My Account
        </h3>
        <p
          className={cn(
            styles.description,
            'talk-plugin-auth--delete-my-account-description'
          )}
        >
          Deleting your account will permanently erase your profile and remove
          all your comments from this site.
        </p>
        <p
          className={cn(
            styles.description,
            'talk-plugin-auth--delete-my-account-description'
          )}
        >
          {scheduledDeletionDate &&
            `You have already submitted a request to delete your account.
          Your account will be deleted on ${moment(
            scheduledDeletionDate
          ).format('MMM Do YYYY, h:mm:ss a')}. You may
          cancel the request until that time`}
        </p>
        {scheduledDeletionDate ? (
          <Button
            className={cn(styles.button, styles.secondary)}
            onClick={this.cancelAccountDeletion}
          >
            Cancel Account Deletion Request
          </Button>
        ) : (
          <Button
            className={cn(styles.button)}
            icon="delete"
            onClick={this.showDialog}
          >
            Delete My Account
          </Button>
        )}
      </div>
    );
  }
}

DeleteMyAccount.propTypes = {
  requestAccountDeletion: PropTypes.func.isRequired,
  cancelAccountDeletion: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
  root: PropTypes.object.isRequired,
};

export default DeleteMyAccount;
