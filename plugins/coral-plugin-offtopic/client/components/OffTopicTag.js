import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';

const isOffTopic = (tags) => !!tags.filter((t) => t.tag.name === 'OFF_TOPIC').length;

export default (props) => (
  <span>
    {
      isOffTopic(props.comment.tags) && props.depth === 0 ? (
        <span className={styles.tag}>
          {t('off_topic')}
        </span>
      ) : null
    }
  </span>
);
