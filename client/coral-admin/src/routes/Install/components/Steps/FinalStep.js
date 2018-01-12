import React from 'react';
import styles from './style.css';
import { Button } from 'coral-ui';
import { Link } from 'react-router';
import cn from 'classnames';

import t from 'coral-framework/services/i18n';

const InitialStep = () => {
  return (
    <div className={cn(styles.step, styles.finalStep, 'talk-install-step-5')}>
      <p>{t('install.final.description')}</p>
      <Button raised>
        <Link to="/admin">{t('install.final.launch')}</Link>
      </Button>
      <Button cStyle="black" raised>
        <a href="http://coralproject.net">{t('install.final.close')}</a>
      </Button>
    </div>
  );
};

export default InitialStep;
