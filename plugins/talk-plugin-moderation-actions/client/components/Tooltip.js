import React from 'react';
import cn from 'classnames';
import styles from './Tooltip.css';
import {t} from 'plugin-api/beta/client/services';
import {Icon} from 'plugin-api/beta/client/components/ui';

export default ({className = '', children}) => (
  <div className={cn(styles.tooltip, className)}>{children}</div>
);
