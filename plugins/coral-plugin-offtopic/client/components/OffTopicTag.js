import React from 'react';
import styles from './styles.css';

const isOffTopic = tags => !!tags.filter(i => i.tag.name === 'OFF_TOPIC').length;

export default (props) => (
  <span>
    {
      isOffTopic(props.comment.tags) ? (
        <span className={styles.tag}>
          Off-topic
        </span>
      ) : null
    }
  </span>
);
