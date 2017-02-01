import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const InviteTeamMembers = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
      <h3>Invite Team Members </h3>
      <p>
        Once registered, new team members will receive an email to Create
        their password.
      </p>
      <form>
        <div className='formField'>
          <label htmlFor='email'>Email address</label>
          <input type='email' name='email' id='email'/>
        </div>
        <div className='formField'>
          <label htmlFor='username'>Username</label>
          <input type='text' name='username' id='username'/>
        </div>
        <div className='formField'>
          <select>
            <option>Admin</option>
            <option>Moderator</option>
          </select>
        </div>
        <Button cStyle='black' onClick={nextStep} full>Invite team member</Button>
      </form>
    </div>
  );
};

export default InviteTeamMembers;
