import React from 'react';
import styles from './style.css';
import {Button} from 'coral-ui';

const InitialStep = props => {
  const {nextStep} = props;
  return (
    <div className={styles.step}>
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
          <label htmlFor='password'>Password</label>
          <input type='password' name='password' id='password'/>
        </div>
        <div className='formField'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input type='password' name='confirmPassword' id='confirmPassword'/>
        </div>
        <Button cStyle='black' onClick={nextStep} full>Save</Button>
      </form>
    </div>
  );
};

export default InitialStep;
