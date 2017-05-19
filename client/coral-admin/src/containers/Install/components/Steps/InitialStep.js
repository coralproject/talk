import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

import t from 'coral-framework/services/i18n';

const InitialStep = (props) => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <p>{t('INITIAL.DESCRIPTION')}</p>
      <Button cStyle='green' onClick={nextStep} raised>{t('INITIAL.SUBMIT')}</Button>
    </div>
  );
};

export default InitialStep;
