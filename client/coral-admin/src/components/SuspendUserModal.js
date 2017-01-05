import I18n from 'coral-framework/modules/i18n/i18n';
import translations from '../translations.json';
import React from 'react';
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
      'j': 'suspenduser.cancel',
      'k': 'suspenduser.send'
    }
  }
];

export default ({stage, actionType, onClose, onButtonClick}) =>
  actionType ? <Modal open={actionType} onClose={onClose}>
      <h3>{lang.t(stages[stage].title)}</h3>
      <div className={styles.container}>
        <div className={styles.description}>
          {lang.t(stages[stage].description)}
        </div>
        {Object.keys(stages[stage].options).map((key, i) => (
          <Button
            label={stages[stage].options[key]}
            onClick={onButtonClick(stage, i)}/>
        ))}
      </div>
    </Modal>
    : null;

const lang = new I18n(translations);
