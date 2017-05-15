import React from 'react';
import {SelectField} from 'react-mdl-selectfield';
import styles from './Select.css';

const Select = (props) => {
  const {children, ...attrs} = props;
  return (
    <SelectField className={styles.Select} {...attrs}>
      {children}
    </SelectField>
  );
};

export default Select;
