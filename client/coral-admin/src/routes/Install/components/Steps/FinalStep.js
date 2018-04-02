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
      <Link to="/admin">
        <Button raised>{t('install.final.launch')}</Button>
      </Link>
      <a href="http://coralproject.net">
        <Button cStyle="black" raised>
          {t('install.final.close')}
        </Button>
      </a>
    </div>
  );
};

export default InitialStep;
