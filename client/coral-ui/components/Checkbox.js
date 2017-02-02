import React from 'react';
import styles from './Checkbox.css';

export default ({name, cStyle = 'base', onChange, label, className, info, ...attrs}) => (
  <label className={`${styles.label} ${styles[`type--${cStyle}`]} ${className}`} htmlFor={name}>
    <input type="checkbox" id={name} name={name} onChange={onChange} {...attrs} />
    <span className={styles.checkbox}></span>
    {label && <span>{label}</span>}
    {info && (
      <div className={styles.checkboxInfo}>
        <h4>{info.title}</h4>
        <span>{info.description}</span>
      </div>
    )}
  </label>
);
