import React from 'react';
import styles from './styles.css'

export default (props) => (
  <div className={styles.box}>
    Comment Status: {props.comment.status}
  </div>
)