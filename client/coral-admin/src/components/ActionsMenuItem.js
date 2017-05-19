import React from 'react';
import cn from 'classnames';
import {MenuItem} from 'react-mdl';
import styles from './ActionsMenu.css';

const ActionsMenuItem = (props) =>
  <MenuItem className={cn(styles.menuItem, props.className)} {...props} />;

export default ActionsMenuItem;
