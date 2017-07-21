import React from 'react';
import styles from './InfoIcon.css';
import cn from 'classnames';
import {Icon} from 'plugin-api/beta/client/components/ui';

export default ({tooltip}) => (
  <Icon 
    name="info_outline"
    className={cn(styles.infoIcon, {[styles.on]: tooltip})}
  />
);
