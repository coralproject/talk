import React from 'react';
import styles from './style.css';
import {Button, Card} from 'coral-ui';
import TagsInput from 'react-tagsinput';

const lang = new I18n(translations);
import translations from '../translations.json';
import I18n from 'coral-framework/modules/i18n/i18n';

const PermittedDomainsStep = (props) => {
  const {finishInstall, install, handleDomainsChange} = props;
  const domains = install.data.settings.domains.whitelist;
  return (
    <div className={styles.step}>
      <h3>{lang.t('PERMITTED_DOMAINS.TITLE')}</h3>
      <Card className={styles.card}>
        <p>{lang.t('PERMITTED_DOMAINS.DESCRIPTION')}</p>
        <TagsInput
          value={domains}
          inputProps={{placeholder: 'URL'}}
          addOnPaste={true}
          pasteSplit={(data) => data.split(',').map((d) => d.trim())}
          onChange={(tags) => handleDomainsChange(tags)}
        />
      </Card>
      <Button cStyle='green' onClick={finishInstall} raised>{lang.t('PERMITTED_DOMAINS.SUBMIT')}</Button>
    </div>
  );
};

export default PermittedDomainsStep;
