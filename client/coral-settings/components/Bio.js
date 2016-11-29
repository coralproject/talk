import React from 'react';
import styles from './Bio.css';
import {Button} from '../../coral-ui';

export default () => (
  <div className={styles.bio}>
    <h1>Bio</h1>
    <p>Tell the community about yourself</p>
    <textarea />
    <div className={styles.actions}>
      <Button cStyle='cancel' raised>Cancel</Button>
      <Button cStyle='success'>Save Changes</Button>
    </div>
  </div>
);

