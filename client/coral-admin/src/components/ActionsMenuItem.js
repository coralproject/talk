import React from 'react';
import cn from 'classnames';
import {MenuItem} from 'react-mdl';
import PropTypes from 'prop-types';
import styles from './ActionsMenu.css';

const ActionsMenuItem = (props) =>
  <MenuItem className={cn(styles.menuItem, props.className)} {...props} />;

ActionsMenuItem.propTypes = {
  className: PropTypes.string,
};

export default ActionsMenuItem;
