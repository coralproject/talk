import React from 'react';
import styles from './style.css';
import {TextField, Button} from 'coral-ui';

import t from 'coral-framework/services/i18n';

const AddOrganizationName = (props) => {
  const {handleSettingsChange, handleSettingsSubmit, install} = props;
  return (
    <div className={styles.step}>
      <p>{t('install.add_organization.description')}</p>
      <div className={styles.form}>
        <form onSubmit={handleSettingsSubmit}>
          <TextField
            className={styles.TextField}
            id="organizationName"
            type="text"
            label={t('install.add_organization.label')}
            onChange={handleSettingsChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.organizationName} />
          <Button type="submit" cStyle='black' full>{t('install.add_organization.save')}</Button>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizationName;
