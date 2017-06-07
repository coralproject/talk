import React, {Component, PropTypes} from 'react';

import {Dialog, Button} from 'coral-ui';
import styles from './SuspendUserDialog.css';

import t from 'coral-framework/services/i18n';

const stages = [
  {
    title: 'suspenduser.title_reject',
    description: 'suspenduser.description_reject',
    options: {
      'j': 'suspenduser.no_cancel',
      'k': 'suspenduser.yes_suspend'
    }
  },
  {
    title: 'suspenduser.title_notify',
    description: 'suspenduser.description_notify',
    options: {
      'j': 'bandialog.cancel',
      'k': 'suspenduser.send'
    }
  }
];

class SuspendUserDialog extends Component  {

  state = {email: '', stage: 0}

  static propTypes = {
    stage: PropTypes.number,
    handleClose: PropTypes.func.isRequired,
    rejectUsername: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.setState({email: t('suspenduser.email_message_reject'), about: t('suspenduser.username')});
  }

  /*
  * When an admin clicks to suspend a user a dialog is shown, this function
  * handles the possible actions for that dialog.
  */
  onActionClick = (stage, menuOption) => () => {
    const {rejectUsername, user} = this.props;
    const {stage} = this.state;

    const cancel = this.props.handleClose;
    const next = () => this.setState({stage: stage + 1});
    const suspend = () => {
      rejectUsername({id: user.user.id, message: this.state.email})
      .then(() => {
        this.props.handleClose();
      });
    };

    const suspendModalActions = [
      [ cancel, next ],
      [ cancel, suspend ]
    ];
    return suspendModalActions[stage][menuOption]();
  }

  onEmailChange = (e) => {
    this.setState({email: e.target.value});
  }

  render () {
    const {open, handleClose} = this.props;
    const {stage} = this.state;

    return <Dialog
            className={styles.suspendDialog}
            id="suspendUserDialog"
            open={open}
            onClose={handleClose}
            onCancel={handleClose}
            title={t('suspenduser.suspend_user')}>
            <div className={styles.title}>
              {t(stages[stage].title, t('suspenduser.username'))}
            </div>
            <div className={styles.container}>
              <div className={styles.description}>
                {t(stages[stage].description, t('suspenduser.username'))}
              </div>
              {
                stage === 1 &&
                <div className={styles.writeContainer}>
                  <div className={styles.emailMessage}>{t('suspenduser.write_message')}</div>
                  <div className={styles.emailContainer}>
                    <textarea
                      rows={5}
                      className={styles.emailInput}
                      value={this.state.email}
                      onChange={this.onEmailChange}/>
                  </div>
                </div>
              }
              <div className={styles.modalButtons}>
                {Object.keys(stages[stage].options).map((key, i) => (
                  <Button key={i} onClick={this.onActionClick(stage, i)}>
                    {t(stages[stage].options[key], t('suspenduser.username'))}
                  </Button>
                ))}
              </div>
            </div>
          </Dialog>;
  }
}

export default SuspendUserDialog;
