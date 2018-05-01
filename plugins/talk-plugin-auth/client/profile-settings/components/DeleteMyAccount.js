import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './DeleteMyAccount.css';
import { Button } from 'plugin-api/beta/client/components/ui';
import DeleteMyAccountDialog from './DeleteMyAccountDialog';

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

  render() {
    return (
      <div className="talk-plugin-auth--delete-my-account">
        <DeleteMyAccountDialog
          requestAccountDeletion={this.props.requestAccountDeletion}
          cancelAccountDeletion={this.props.cancelAccountDeletion}
          closeDialog={this.closeDialog}
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
        <Button
          className={cn(styles.button)}
          icon="delete"
          onClick={this.onSave}
        >
          Delete My Account
        </Button>
      </div>
    );
  }
}

DeleteMyAccount.propTypes = {
  requestAccountDeletion: PropTypes.func.isRequired,
  cancelAccountDeletion: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

export default DeleteMyAccount;
