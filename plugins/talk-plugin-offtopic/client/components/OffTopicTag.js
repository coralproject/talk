import React from 'react';
import styles from './OffTopicTag.css';
import { t } from 'plugin-api/beta/client/services';
import { isTagged } from 'plugin-api/beta/client/utils';
import cn from 'classnames';

export default props => (
  <span>
    {isTagged(props.comment.tags, 'OFF_TOPIC') && props.depth === 0 ? (
      <span
        className={cn(styles.tag, 'talk-stream-comment-offtopic-tag-label')}
      >
        {t('off_topic')}
      </span>
    ) : null}
  </span>
);
