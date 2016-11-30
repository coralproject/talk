import React from 'react';
import styles from './Bio.css';
import {Button} from '../../coral-ui';

export default ({bio, handleSave, handleInput}) => (
  <div className={styles.bio}>
    <h1>Bio</h1>
    <p>Tell the community about yourself</p>
    <form onSubmit={handleSave}>
      <textarea defaultValue={bio} ref={handleInput} />
      <div className={styles.actions}>
        <Button cStyle='cancel' raised>Cancel</Button>
        <Button cStyle='success' type="submit">Save Changes</Button>
      </div>
    </form>
  </div>
);

