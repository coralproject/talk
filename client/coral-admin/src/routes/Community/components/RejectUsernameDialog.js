import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Dialog, Button } from 'coral-ui';
import styles from './RejectUsernameDialog.css';

import t from 'coral-framework/services/i18n';

const stages = [
  {
    title: 'reject_username.title_reject',
    description: 'reject_username.description_reject',
    options: {
      j: 'reject_username.no_cancel',
      k: 'reject_username.yes_suspend',
    },
  },
  {
    title: 'reject_username.title_notify',
    description: 'reject_username.description_notify',
    options: {
      j: 'bandialog.cancel',
      k: 'reject_username.send',
    },
  },
];

class RejectUsernameDialog extends Component {
  state = { email: '', stage: 0 };

  componentDidMount() {
    this.setState({
      email: t('reject_username.email_message_reject'),
      about: t('reject_username.username'),
    });
  }

  /*
  * When an admin clicks to suspend a user a dialog is shown, this function
  * handles the possible actions for that dialog.
  */
  onActionClick = (stage, menuOption) => () => {
    const { rejectUsername, user } = this.props;
    const { stage } = this.state;

    const cancel = this.props.handleClose;
    const next = () => this.setState({ stage: stage + 1 });
    const suspend = async () => {
      try {
        await rejectUsername(user.id);
        this.props.handleClose();
      } catch (err) {
        // TODO: handle error.
        console.error(err);
      }
    };

    const suspendModalActions = [[cancel, next], [cancel, suspend]];
    return suspendModalActions[stage][menuOption]();
  };

  onEmailChange = e => {
    this.setState({ email: e.target.value });
  };

  render() {
    const { open, handleClose } = this.props;
    const { stage } = this.state;

    return (
      <Dialog
        className={cn(
          styles.suspendDialog,
          'talk-admin-reject-reported-username-dialog'
        )}
        id="rejectUsernameDialog"
        open={open}
        onClose={handleClose}
        onCancel={handleClose}
        title={t('reject_username.suspend_user')}
      >
        <div className={styles.title}>
          {t(stages[stage].title, t('reject_username.username'))}
        </div>
        <div
          className={cn(
            styles.container,
            `talk-admin-reject-reported-username-dialog-step-${stage}`
          )}
        >
          <div className={styles.description}>
            {t(stages[stage].description, t('reject_username.username'))}
          </div>

          {/* {

          // Suspension Message: This functionality it's not entirely done on the BE - It will be released soon.
          stage === 1 &&
                <div className={styles.writeContainer}>
                  <div className={styles.emailMessage}>{t('reject_username.write_message')}</div>
                  <div className={styles.emailContainer}>
                    <textarea
                      rows={5}
                      className={cn(styles.emailInput, 'talk-admin-reject-reported-username-dialog-suspension-message')}
                      value={this.state.email}
                      onChange={this.onEmailChange}/>
                  </div>
                </div>
        } */}
          <div
            className={cn(
              styles.modalButtons,
              'talk-admin-reject-reported-username-dialog-buttons'
            )}
          >
            {Object.keys(stages[stage].options).map((key, i) => (
              <Button
                key={i}
                className={cn(
                  'talk-admin-username-dialog-button',
                  `talk-admin-reject-reported-username-dialog-button-${key}`
                )}
                onClick={this.onActionClick(stage, i)}
              >
                {t(stages[stage].options[key], t('reject_username.username'))}
              </Button>
            ))}
          </div>
        </div>
      </Dialog>
    );
  }
}

RejectUsernameDialog.propTypes = {
  stage: PropTypes.number,
  handleClose: PropTypes.func.isRequired,
  rejectUsername: PropTypes.func.isRequired,
  user: PropTypes.object,
  open: PropTypes.bool,
};

export default RejectUsernameDialog;
