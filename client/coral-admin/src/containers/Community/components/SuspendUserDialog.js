import React, {Component, PropTypes} from 'react';

import {Dialog, Button} from 'coral-ui';
import styles from './SuspendUserDialog.css';

import t from 'coral-i18n/services/i18n';

const stages = [
  {
    title: 'suspenduser.title_0',
    description: 'suspenduser.description_0',
    options: {
      'j': 'suspenduser.no_cancel',
      'k': 'suspenduser.yes_suspend'
    }
  },
  {
    title: 'suspenduser.title_1',
    description: 'suspenduser.description_1',
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
    suspendUser: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.setState({email: t('suspenduser.email'), about: t('suspenduser.username')});
  }

  /*
  * When an admin clicks to suspend a user a dialog is shown, this function
  * handles the possible actions for that dialog.
  */
  onActionClick = (stage, menuOption) => () => {
    const {suspendUser, user} = this.props;
    const {stage} = this.state;

    const cancel = this.props.handleClose;
    const next = () => this.setState({stage: stage + 1});
    const suspend = () => {
      suspendUser({userId: user.user.id, message: this.state.email})
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
            title={t('suspenduser.title')}>
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
