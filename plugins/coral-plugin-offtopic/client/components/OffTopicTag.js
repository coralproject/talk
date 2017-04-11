import React from 'react';
import styles from './styles.css';

export default (props) => (
  <span className={styles.tag}>
    {console.log('Offtopic tag', props.offtopic)}
    Off-topic
  </span>
);
