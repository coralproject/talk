import React from 'react';
import styles from './style.css';

export default (props) => (
  <div className={styles.Respect} key={props.key}>
    {console.log(props)}
    <button onClick={props.actions.clickButton}>Respect</button>
  </div>
);

