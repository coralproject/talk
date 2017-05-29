import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

import t from 'coral-framework/services/i18n';

const InitialStep = (props) => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <p>{t('install.initial.description')}</p>
      <Button cStyle='green' onClick={nextStep} raised>{t('install.initial.submit')}</Button>
    </div>
  );
};

export default InitialStep;
