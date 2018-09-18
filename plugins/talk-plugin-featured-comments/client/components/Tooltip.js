import React from 'react';
import cn from 'classnames';
import styles from './Tooltip.css';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';

export default ({ className = '' }) => (
  <div
    className={cn(
      styles.tooltip,
      className,
      'talk-plugin-featured-comments-tooltip'
    )}
  >
    <Icon name="info_outline" className={styles.icon} />
    <h3 className={styles.headline}>
      {t('talk-plugin-featured-comments.featured_comments')}:
    </h3>
    <p className={styles.description}>
      {t('talk-plugin-featured-comments.tooltip_description')}
    </p>
  </div>
);
