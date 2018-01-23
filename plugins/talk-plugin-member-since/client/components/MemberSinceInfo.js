import React from 'react';
import styles from './MemberSinceInfo.css';
import { t } from 'plugin-api/beta/client/services';
import { Icon } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';
import moment from 'moment';

export default ({ memberSinceDate }) => (
  <div className={cn(styles.root, 'talk-plugin-member-since')}>
    <Icon
      name="date_range"
      className={cn(styles.icon, 'talk-plugin-member-since-icon')}
    />
    <span className={cn(styles.memberSince, 'talk-plugin-member-since-date')}>
      {t('talk-plugin-member-since.member_since')}:{' '}
      {moment(new Date(memberSinceDate)).format('MMM DD, YYYY')}
    </span>
  </div>
);
