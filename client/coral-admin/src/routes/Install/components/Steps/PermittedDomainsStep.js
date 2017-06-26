import React from 'react';
import styles from './style.css';
import {Button, Card} from 'coral-ui';
import TagsInput from 'react-tagsinput';

import t from 'coral-framework/services/i18n';

const PermittedDomainsStep = (props) => {
  const {finishInstall, install, handleDomainsChange} = props;
  const domains = install.data.settings.domains.whitelist;
  return (
    <div className={styles.step}>
      <h3>{t('install.permitted_domains.title')}</h3>
      <Card className={styles.card}>
        <p>{t('install.permitted_domains.description')}</p>
        <TagsInput
          value={domains}
          inputProps={{placeholder: 'URL'}}
          addOnBlur={true}
          addOnPaste={true}
          pasteSplit={(data) => data.split(',').map((d) => d.trim())}
          onChange={(tags) => handleDomainsChange(tags)}
        />
      </Card>
      <Button cStyle='green' onClick={finishInstall} raised>{t('install.permitted_domains.submit')}</Button>
    </div>
  );
};

export default PermittedDomainsStep;
