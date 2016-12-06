import React from 'react';
import {Button, Checkbox} from 'coral-ui';
import styles from './ConfigureCommentStream.css';

export default ({handleChange, handleApply, changed, ...props}) => (
  <div className={styles.wrapper}>
    <div className={styles.container}>
      <h3>Configure Comment Stream</h3>
      <p>
        As an admin you may customize the settings for the comment stream for this article
      </p>
      <Button
        className={styles.apply}
        cStyle={changed ? 'green' : 'darkGrey'}
        onClick={handleApply}
      >
        Apply
      </Button>
    </div>
    <ul>
      <li>
        <Checkbox
          className={styles.checkbox}
          cStyle={changed ? 'green' : 'darkGrey'}
          name="premod"
          onChange={handleChange}
          checked={props.premod}
          info={{
            title: 'Enable Premoderation',
            description: 'Moderators must approve any comment before its published'
          }}
        />
        <ul>
          <li>
            <Checkbox
              className={styles.checkbox}
              cStyle={changed ? 'green' : 'darkGrey'}
              name="premodLinks"
              onChange={handleChange}
              checked={props.premodLinks}
              info={{
                title: 'Pre-Moderate Comments Containing Links',
                description: 'Moderators must approve any comment containing a link before its published.'
              }}
            />
          </li>
        </ul>
      </li>
    </ul>
  </div>
);
