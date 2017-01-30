import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import React, {Component, PropTypes} from 'react';
import Modal from 'components/Modal';
import styles from './SuspendUserModal.css';
import {Button} from 'coral-ui';

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

class SuspendUserModal extends Component  {

  state = {email: '', stage: 0}

  static propTypes = {
    stage: PropTypes.number,
    actionType: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    suspendUser: PropTypes.func.isRequired
  }

  componentDidMount() {
    const about = this.props.actionType === 'flag_bio' ? lang.t('suspenduser.bio') : lang.t('suspenduser.username');
    this.setState({email: lang.t('suspenduser.email', about)});
  }

  /*
  * When an admin clicks to suspend a user a dialog is shown, this function
  * handles the possible actions for that dialog.
  */
  onActionClick = (stage, menuOption) => () => {
    const {suspendUser, action} = this.props;
    const {stage, email} = this.state;
    const cancel = this.props.onClose;
    const next = () => this.setState({stage: stage + 1});
    const suspend = () => suspendUser(action.item_id, lang.t('suspenduser.email_subject'), email)
      .then(this.props.onClose);
    const suspendModalActions = [
      [ cancel, next ],
      [ cancel, suspend ]
    ];
    return suspendModalActions[stage][menuOption]();
  }

  onEmailChange = (e) => this.setState({email: e.target.value})

  render () {
    const {action, onClose} = this.props;

    if (!action) {
      return null;
    }

    const {stage} = this.state;
    const actionType = action.actionType;
    const about = actionType === 'flag_bio' ? lang.t('suspenduser.bio') : lang.t('suspenduser.username');
    return <Modal open={true} onClose={onClose}>
        <div className={styles.title}>{lang.t(stages[stage].title, about)}</div>
        <div className={styles.container}>
          <div className={styles.description}>
            {lang.t(stages[stage].description, about)}
          </div>
          {
            stage === 1 &&
            <div className={styles.writeContainer}>
              <div className={styles.emailMessage}>{lang.t('suspenduser.write_message')}</div>
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
                {lang.t(stages[stage].options[key], about)}
              </Button>
            ))}
        </div>
        </div>
      </Modal>;
  }
}

export default SuspendUserModal;

const lang = new I18n(translations);
