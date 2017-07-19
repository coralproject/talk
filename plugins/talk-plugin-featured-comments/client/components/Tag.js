import React from 'react';
import styles from './Tag.css';
import {t} from 'plugin-api/beta/client/services';
import {isTagged} from 'plugin-api/beta/client/utils';

export default (props) => (
  <span>
    {
      isTagged(props.comment.tags, 'FEATURED') && props.depth === 0 ? (
        <span className={styles.tag}>
          {t('talk-plugin-featured-comments.featured')}
        </span>
      ) : null
    }
  </span>
);
