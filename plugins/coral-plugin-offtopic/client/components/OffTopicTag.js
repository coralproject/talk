import React from 'react';
import styles from './styles.css';

const isOffTopic = (tags) => {
  return !!tags.filter(tag => tag.name === 'OFF_TOPIC').length
}

export default (props) => (
  <span>
    {console.log(props)}
    {
      isOffTopic(props.comment.tags) ? (
        <span className={styles.tag}>
          Off-topic
        </span>
      ) : null
    }
  </span>
);
