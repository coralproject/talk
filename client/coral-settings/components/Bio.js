import React from 'react';
import styles from './Bio.css';
import {Button} from '../../coral-ui';

export default ({user, handleSaveBio}) => (
  <div className={styles.bio}>
    <h1>Bio</h1>
    <p>Tell the community about yourself</p>
    <textarea defaultValue={user.bio}/>
    <div className={styles.actions}>
      <Button cStyle='cancel' raised>Cancel</Button>
      <Button cStyle='success' onClick={handleSaveBio}>Save Changes</Button>
    </div>
  </div>
);

