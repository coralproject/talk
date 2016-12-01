import React from 'react';
import styles from './Bio.css';
import {Button} from '../../coral-ui';

export default ({bio, handleSave, handleInput, handleCancel}) => (
  <div className={styles.bio}>
    <h1>Bio</h1>
    <p>Tell the community about yourself</p>
    <form>
      <textarea value={bio} onChange={handleInput} />
      <div className={styles.actions}>
        <Button cStyle='cancel' type="button" onClick={handleCancel} raised>Cancel</Button>
        <Button cStyle='success' type="submit" onClick={handleSave}>Save Changes</Button>
      </div>
    </form>
  </div>
);

