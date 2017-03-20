import React from 'react';
import styles from './style.css';
import { Button } from 'coral-ui';

const lang = new I18n(translations);
import translations from '../../translations.json';
import I18n from 'coral-framework/modules/i18n/i18n';

const InitialStep = props => {
  const { nextStep } = props;
  return (
    <div className={styles.step}>
      <p>{lang.t('INITIAL.DESCRIPTION')}</p>
      <Button cStyle='green' onClick={nextStep} raised>{lang.t('INITIAL.SUBMIT')}</Button>
    </div>
  );
};

export default InitialStep;
