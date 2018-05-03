import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import moment from 'moment';
import styles from './DeleteMyAccount.css';
import { Button } from 'plugin-api/beta/client/components/ui';
import DeleteMyAccountDialog from './DeleteMyAccountDialog';
import { getErrorMessages } from 'coral-framework/utils';
import { t } from 'plugin-api/beta/client/services';

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
        t('talk-plugin-profile-data.delete_request.account_deletion_requested')
      );
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  requestAccountDeletion = async () => {
    const { requestAccountDeletion, notify } = this.props;
    try {
      await requestAccountDeletion();
      notify(
        'success',
        t('talk-plugin-profile-data.delete_request.account_deletion_requested')
      );
    } catch (err) {
      notify('error', getErrorMessages(err));
    }
  };

  render() {
    const { me: { scheduledDeletionDate } } = this.props.root;
    return (
      <div className="talk-plugin-auth--delete-my-account">
        <DeleteMyAccountDialog
          requestAccountDeletion={this.requestAccountDeletion}
          showDialog={this.state.showDialog}
          closeDialog={this.closeDialog}
        />
        <h3
          className={cn(
            styles.title,
            'talk-plugin-auth--delete-my-account-description'
          )}
        >
          {t('talk-plugin-profile-data.delete_request.delete_my_account')}
        </h3>
        <p
          className={cn(
            styles.description,
            'talk-plugin-auth--delete-my-account-description'
          )}
        >
          {t(
            'talk-plugin-profile-data.delete_request.delete_my_account_description'
          )}
        </p>
        <p
          className={cn(
            styles.description,
            'talk-plugin-auth--delete-my-account-description'
          )}
        >
          {scheduledDeletionDate &&
            t(
              'talk-plugin-profile-data.delete_request.already_submitted_request_description',
              moment(scheduledDeletionDate).format('MMM Do YYYY, h:mm:ss a')
            )}
        </p>
        {scheduledDeletionDate ? (
          <Button
            className={cn(styles.button, styles.secondary)}
            onClick={this.cancelAccountDeletion}
          >
            {t(
              'talk-plugin-profile-data.delete_request.cancel_account_deletion_request'
            )}
          </Button>
        ) : (
          <Button
            className={cn(styles.button)}
            icon="delete"
            onClick={this.showDialog}
          >
            {t('talk-plugin-profile-data.delete_request.delete_my_account')}
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
