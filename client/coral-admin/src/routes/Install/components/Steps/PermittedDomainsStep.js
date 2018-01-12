import React from 'react';
import styles from './style.css';
import { Button, Card } from 'coral-ui';
import TagsInput from 'coral-admin/src/components/TagsInput';
import PropTypes from 'prop-types';
import cn from 'classnames';
import t from 'coral-framework/services/i18n';

const PermittedDomainsStep = props => {
  const { finishInstall, install, handleDomainsChange } = props;
  const domains = install.data.settings.domains.whitelist;
  return (
    <div className={cn(styles.step, 'talk-install-step-4')}>
      <h3>{t('install.permitted_domains.title')}</h3>
      <Card className={styles.card}>
        <p>{t('install.permitted_domains.description')}</p>
        <TagsInput
          className="talk-install-step-4-permited-domains-input"
          value={domains}
          inputProps={{ placeholder: 'URL' }}
          onChange={tags => handleDomainsChange(tags)}
        />
      </Card>
      <Button
        className="talk-install-step-4-save-button"
        cStyle="green"
        onClick={finishInstall}
        raised
      >
        {t('install.permitted_domains.submit')}
      </Button>
    </div>
  );
};

PermittedDomainsStep.propTypes = {
  finishInstall: PropTypes.func,
  handleDomainsChange: PropTypes.func,
  install: PropTypes.object,
};

export default PermittedDomainsStep;
