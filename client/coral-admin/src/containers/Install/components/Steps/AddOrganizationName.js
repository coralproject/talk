import React from 'react';
import styles from './style.css';
import {FormField, Button} from 'coral-ui';

const AddOrganizationName = props => {
  const {handleSettingsChange, handleSettingsSubmit, install} = props;
  return (
    <div className={styles.step}>
      <p>
        Please tell us the name of your organization. This will appear in emails when
        inviting new team members
      </p>
      <div className={styles.form}>
        <form onSubmit={handleSettingsSubmit}>
          <FormField
            className={styles.FormField}
            id="organizationName"
            type="text"
            label='Organization name'
            onChange={handleSettingsChange}
            showErrors={install.showErrors}
            errorMsg={install.errors.organizationName} />
          <Button type="submit" cStyle='black' full>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizationName;
