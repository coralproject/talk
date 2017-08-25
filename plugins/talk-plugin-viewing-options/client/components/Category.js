import React from 'react';
import styles from './Category.css';
import {Slot, IfSlotIsNotEmpty} from 'plugin-api/beta/client/components';

const childFactory = (child) => <li className={styles.listItem} key={child.key}>{child}</li>;

const ViewingOptions = ({slot, title}) => {
  return (
    <IfSlotIsNotEmpty slot={slot} className={styles.root}>
      <div className={styles.title}>{title}</div>
      <Slot fill={slot} childFactory={childFactory} className={styles.list} component={'ul'}/>
    </IfSlotIsNotEmpty>
  );
};

export default ViewingOptions;
