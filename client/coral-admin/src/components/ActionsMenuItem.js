import React from 'react';
import cn from 'classnames';
import { MenuItem } from 'react-mdl';
import PropTypes from 'prop-types';
import styles from './ActionsMenu.css';
import camelCase from 'lodash/camelCase';

const ActionsMenuItem = props => (
  <MenuItem
    className={cn(styles.menuItem, props.className, 'action-menu-item')}
    {...props}
    id={camelCase(props.children)}
  />
);

ActionsMenuItem.propTypes = {
  className: PropTypes.string,
  children: PropTypes.string,
};

export default ActionsMenuItem;
