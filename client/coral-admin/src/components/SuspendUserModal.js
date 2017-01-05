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

  state = {email: ''}

  static propTypes = {
    stage: PropTypes.number,
    actionType: PropTypes.string,
    onClose: PropTypes.func.isRequired,
    onButtonClick: PropTypes.func.isRequired
  }

  componentDidMount() {
    const about = this.props.actionType === 'flag_bio' ? lang.t('suspenduser.bio') : lang.t('suspenduser.username');
    this.setState({email: lang.t('suspenduser.email', about)});
  }

  onEmailChange = (e) => this.setState({email: e.target.value})

  render () {
    const {stage, actionType, onClose, onButtonClick} = this.props;
    const about = actionType === 'flag_bio' ? lang.t('suspenduser.bio') : lang.t('suspenduser.username');
    return actionType ? <Modal open={actionType} onClose={onClose}>
        <h3>{lang.t(stages[stage].title, about)}</h3>
        <div className={styles.container}>
          <div className={styles.description}>
            {lang.t(stages[stage].description, about)}
          </div>
          {
            stage === 1 &&
            <textarea
              rows={10}
              value={this.state.email}
              onChange={this.onEmailChange}/>
          }
          {Object.keys(stages[stage].options).map((key, i) => (
            <Button onClick={onButtonClick(stage, i)}>
              {lang.t(stages[stage].options[key], about)}
            </Button>
          ))}
        </div>
      </Modal>
      : null;
  }
}

export default SuspendUserModal;

const lang = new I18n(translations);
