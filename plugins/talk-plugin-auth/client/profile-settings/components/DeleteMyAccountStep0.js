import React from 'react';
import cn from 'classnames';
import { Button, Icon } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';

const DeleteMyAccountStep0 = () => (
  <div className={styles.step}>
    <p className={styles.description}>
      You are attempting to delete your account. This means:
    </p>
    <ul className={styles.list}>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          All of your comments are removed from this site
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          All of your comments are deleted from our database
        </span>
      </li>
      <li className={styles.item}>
        <Icon name="done" className={styles.itemIcon} />
        <span className={styles.text}>
          Your username and email address are removed from our system
        </span>
      </li>
    </ul>
    <div className={cn(styles.actions)}>
      <Button className={cn(styles.button, styles.cancel)}>Cancel</Button>
      <Button
        className={cn(styles.button, styles.proceed)}
        onClick={this.goToNextStep}
      >
        Proceed
      </Button>
    </div>
  </div>
);

export default DeleteMyAccountStep0;
