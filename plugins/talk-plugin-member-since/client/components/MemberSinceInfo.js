import React from 'react';
import styles from './MemberSinceInfo.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import moment from 'moment';

export default ({memberSinceDate}) => (
  <div className={styles.root}>
    <Icon name="date_range" className={styles.icon} />
    <span className={styles.memberSince}>
      {t('talk-plugin-member-since.member_since')}: {moment(new Date(memberSinceDate)).format('MMM DD, YYYY')}
    </span>
  </div>
);
