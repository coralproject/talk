import React from 'react';
import styles from './Bio.css';
import {Button} from '../../coral-ui';

export default ({userData, bio, handleSave, handleChange}) => (
  <div className={styles.bio}>
    <h1>Bio</h1>
    <p>Tell the community about yourself</p>
    <textarea defaultValue={userData.bio} value={bio} onChange={handleChange} />
    <div className={styles.actions}>
      <Button cStyle='cancel' raised>Cancel</Button>
      <Button cStyle='success' onClick={handleSave}>Save Changes</Button>
    </div>
  </div>
);

