import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';
import {Link} from 'react-router';

import t from 'coral-i18n/services/i18n';

const InitialStep = () => {
  return (
    <div className={`${styles.step} ${styles.finalStep}`}>
      <p>{t('FINAL.DESCRIPTION')}</p>
      <Button raised><Link to='/admin'>{t('FINAL.LAUNCH')}</Link></Button>
      <Button cStyle='black' raised><a href="http://coralproject.net">{t('FINAL.CLOSE')}</a></Button>
    </div>
  );
};

export default InitialStep;
