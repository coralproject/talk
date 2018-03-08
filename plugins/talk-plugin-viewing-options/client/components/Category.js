import React from 'react';
import styles from './Category.css';
import { Slot } from 'plugin-api/beta/client/components';

const childFactory = child => (
  <li className={styles.listItem} key={child.key}>
    {child}
  </li>
);

const ViewingOptions = ({ slot, title, data, asset, root }) => {
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <Slot
        fill={slot}
        childFactory={childFactory}
        className={styles.list}
        component={'ul'}
        data={data}
        queryData={{ asset, root }}
      />
    </div>
  );
};

export default ViewingOptions;
