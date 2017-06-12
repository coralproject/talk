import React from 'react';
import styles from './styles.css';

const Link = ({url, key}) => (
  <span>
    {' '}
    <a href={`//${url}`} key={key} className={styles.link} target="_blank">
      {url}
    </a>
  </span>
);

export default Link;
