import React from 'react';
import PropTypes from 'prop-types';
import styles from './Category.css';
import { Slot } from 'plugin-api/beta/client/components';

const childFactory = child => (
  <li className={styles.listItem} key={child.key}>
    {child}
  </li>
);

const Category = ({ slot, title, slotPassthrough }) => {
  return (
    <div className={styles.root}>
      <div className={styles.title}>{title}</div>
      <Slot
        fill={slot}
        childFactory={childFactory}
        className={styles.list}
        component={'ul'}
        passthrough={slotPassthrough}
      />
    </div>
  );
};

Category.propTypes = {
  slot: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  slotPassthrough: PropTypes.object.isRequired,
};

export default Category;
