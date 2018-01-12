import React from 'react';
import styles from './style.css';
import { Button } from 'coral-ui';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';

const InitialStep = props => {
  const { nextStep } = props;
  return (
    <div className={cn(styles.step, 'talk-install-step-1')}>
      <p>{t('install.initial.description')}</p>
      <Button
        className={'talk-install-get-started-button'}
        cStyle="green"
        onClick={nextStep}
        raised
      >
        {t('install.initial.submit')}
      </Button>
    </div>
  );
};

InitialStep.propTypes = {
  nextStep: PropTypes.func,
};

export default InitialStep;
