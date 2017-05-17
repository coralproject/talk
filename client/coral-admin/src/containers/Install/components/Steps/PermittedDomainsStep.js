import React from 'react';
import styles from './style.css';
import {Button, Card} from 'coral-ui';
import TagsInput from 'react-tagsinput';

import t from 'coral-i18n/services/i18n';

const PermittedDomainsStep = (props) => {
  const {finishInstall, install, handleDomainsChange} = props;
  const domains = install.data.settings.domains.whitelist;
  return (
    <div className={styles.step}>
      <h3>{t('PERMITTED_DOMAINS.TITLE')}</h3>
      <Card className={styles.card}>
        <p>{t('PERMITTED_DOMAINS.DESCRIPTION')}</p>
        <TagsInput
          value={domains}
          inputProps={{placeholder: 'URL'}}
          addOnPaste={true}
          pasteSplit={(data) => data.split(',').map((d) => d.trim())}
          onChange={(tags) => handleDomainsChange(tags)}
        />
      </Card>
      <Button cStyle='green' onClick={finishInstall} raised>{t('PERMITTED_DOMAINS.SUBMIT')}</Button>
    </div>
  );
};

export default PermittedDomainsStep;
