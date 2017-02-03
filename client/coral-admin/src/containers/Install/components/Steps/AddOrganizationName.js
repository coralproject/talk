import React from 'react';
import styles from './style.css';
import {FormField, Button} from 'coral-ui';

const InitialStep = () => {
  return (
    <div className={styles.step}>
      <p>
        Please tell us the name of your organization. This will appear in emails when
        inviting new team members
      </p>
      <div className={styles.form}>
        <form onSubmit={() => {}}>
          <FormField
            className={styles.FormField}
            id="organizationName"
            type="text"
            label='Organization name' required/>
          <Button cStyle='black' full>Save</Button>
        </form>
      </div>
    </div>
  );
};

export default InitialStep;
