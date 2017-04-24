import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';
import {Link} from 'react-router';

const lang = new I18n(translations);
import translations from '../../translations.json';
import I18n from 'coral-i18n/modules/i18n/i18n';

const InitialStep = () => {
  return (
    <div className={`${styles.step} ${styles.finalStep}`}>
      <p>{lang.t('FINAL.DESCRIPTION')}</p>
      <Button raised><Link to='/admin'>{lang.t('FINAL.LAUNCH')}</Link></Button>
      <Button cStyle='black' raised><a href="http://coralproject.net">{lang.t('FINAL.CLOSE')}</a></Button>
    </div>
  );
};

export default InitialStep;
