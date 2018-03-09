import React from 'react';
import styles from './BlankCommentHistory.css';
import { Icon } from 'coral-ui';
import cn from 'classnames';

import t from 'coral-framework/services/i18n';

export default () => (
  <section className={cn(styles.root, 'talk-my-profile-comment-history-blank')}>
    <Icon name="chat" className={styles.icon} />
    <h1 className={styles.title}>{t('comment_history_blank.title')}</h1>
    <p className={styles.info}>{t('comment_history_blank.info')}</p>
  </section>
);
