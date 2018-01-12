import React from 'react';
import styles from './SubscriberBadge.css';
import { t } from 'plugin-api/beta/client/services';

export default () => (
  <span className={styles.badge}>{t('talk-plugin-subscriber.subscriber')}</span>
);
