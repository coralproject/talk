import React from 'react';
import styles from './styles.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

export default ({banUser, comment: {}}) => (
  <button 
    className={cn(styles.button, 'talk-plugin-moderation-actions-reject')}
    onClick={banUser} >
    Ban User
  </button>
);
