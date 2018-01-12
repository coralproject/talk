import React from 'react';
import styles from './style.css';
import { Button, Select, Option, TextField } from 'coral-ui';

const InviteTeamMembers = props => {
  const { nextStep } = props;
  return (
    <div className={styles.step}>
      <h3>Invite Team Members </h3>
      <p>
        Once registered, new team members will receive an email to Create their
        password.
      </p>
      <div className={styles.form}>
        <form>
          <TextField
            className={styles.textField}
            id="email"
            type="email"
            label="Email address"
            required
          />

          <TextField
            className={styles.textField}
            id="username"
            type="text"
            label="Username"
            required
          />

          <div className={styles.textField}>
            <label htmlFor="role">Assing a role</label>
            <Select id="role" label="Select Role">
              <Option>Admin</Option>
              <Option>Moderator</Option>
            </Select>
          </div>

          <Button cStyle="black" onClick={nextStep} icon="arrow_forward" full>
            Invite team member
          </Button>
        </form>
      </div>
    </div>
  );
};

export default InviteTeamMembers;
