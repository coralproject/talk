import React from 'react';
import styles from './OffTopicTag.css';
import {t} from 'plugin-api/beta/client/services';
import {isTagged} from 'plugin-api/beta/client/utils';

export default (props) => (
  <span>
    {
      isTagged(props.comment.tags, 'OFF_TOPIC') && props.depth === 0 ? (
        <span className={styles.tag}>
          {t('off_topic')}
        </span>
      ) : null
    }
  </span>
);
