import React from 'react';
import styles from './style.css';

export default (props) => (
  <div className={styles.Respect} key={props.key}>
    <button onClick={props.pluginProps.clickButton}>Respect</button>
  </div>
);

