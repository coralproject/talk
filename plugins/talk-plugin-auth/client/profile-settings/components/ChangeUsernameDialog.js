import React from 'react';
import cn from 'classnames';
import styles from './ChangeUsernameDialog.css';
import InputField from './InputField';
import Form from './Form';
import { Button, Dialog } from 'plugin-api/beta/client/components/ui';

class ChangeUsernameDialog extends React.Component {
  state = {
    showErrors: false,
  };

  showErrors = () => {
    this.setState({
      showErrors: true,
    });
  };

  confirmChanges = async () => {
    if (this.formHasError()) {
      this.showErrors();
    } else {
      // await this.props.saveChanges
      this.props.closeDialog();
    }
  };

  formHasError = () =>
    this.props.formData.confirmNewUsername !== this.props.formData.newUsername;

  render() {
    return (
      <Dialog
        open={this.props.showDialog}
        className={cn(styles.dialog, 'talk-plugin-auth--edit-profile-dialog')}
      >
        <span className={styles.close} onClick={this.props.closeDialog}>
          ×
        </span>
        <h1 className={styles.title}>Confirm Username Change</h1>
        <div className={styles.content}>
          <p className={styles.description}>
            You are attempting to change your username. Your new username will
            appear on all of your past and future comments.
          </p>
          <div className={styles.usernamesChange}>
            <span className={styles.item}>
              Old Username: {this.props.username}
            </span>
            <span className={styles.item}>
              New Username: {this.props.formData.newUsername}
            </span>
          </div>
          <Form>
            <InputField
              id="confirmNewUsername"
              label="Re-enter new username"
              name="confirmNewUsername"
              type="text"
              onChange={this.props.onChange}
              value={this.props.formData.confirmNewUsername}
              hasError={this.formHasError() && this.state.showErrors}
              errorMsg={'Username does not match'}
              showErrors={this.state.showErrors}
              columnDisplay
              showSuccess={false}
            >
              <span className={styles.bottomNote}>
                Note: You will not be able to change your username again for 14
                days
              </span>
            </InputField>
          </Form>
          <div className={styles.bottomActions}>
            <Button className={styles.cancel}>Cancel</Button>
            <Button
              className={styles.confirmChanges}
              onClick={this.confirmChanges}
            >
              Confirm Changes
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ChangeUsernameDialog;
