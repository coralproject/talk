import React from 'react';
import styles from './FeaturedTag.css';
import {t} from 'plugin-api/beta/client/services';

const isFeatured = (tags) => !!tags.filter((t) => t.tag.name === 'FEATURED').length;

export default (props) => (
  <span>
    {
      isFeatured(props.comment.tags) && props.depth === 0 ? (
        <span className={styles.tag}>
          {t('featured')}
        </span>
      ) : null
    }
  </span>
);
