import React from 'react';
import styles from './style.css';
import { TextField, Button } from 'coral-ui';
import PropTypes from 'prop-types';
import t from 'coral-framework/services/i18n';
import cn from 'classnames';

const AddOrganizationName = props => {
  const { handleSettingsChange, handleSettingsSubmit, install } = props;
  return (
    <div className={cn(styles.step, 'talk-install-step-2')}>
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
            errorMsg={install.errors.organizationName}
          />
          <Button
            className="talk-install-step-2-save-button"
            type="submit"
            cStyle="black"
            full
          >
            {t('install.add_organization.save')}
          </Button>
        </form>
      </div>
    </div>
  );
};

AddOrganizationName.propTypes = {
  handleSettingsChange: PropTypes.func,
  handleSettingsSubmit: PropTypes.func,
  install: PropTypes.object,
};

export default AddOrganizationName;
