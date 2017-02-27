import React from 'react';
import styles from './style.css';
import {TextField, Button} from 'coral-ui';

const lang = new I18n(translations);
import translations from '../../translations.json';
import I18n from 'coral-framework/modules/i18n/i18n';

const AddOrganizationName = props => {
  const {handleSettingsChange, handleSettingsSubmit, install} = props;
  return (
    <div className={styles.step}>
      <p>{lang.t('ADD_ORGANIZATION.DESCRIPTION')}</p>
      <div className={styles.form}>
        <form onSubmit={handleSettingsSubmit}>
          <TextField
            className={styles.TextField}
            id="organizationName"
            type="text"
            label={lang.t('ADD_ORGANIZATION.DESCRIPTION')}
            onChange={handleSettingsChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.organizationName} />
          <Button type="submit" cStyle='black' full>{lang.t('ADD_ORGANIZATION.SAVE')}</Button>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizationName;
