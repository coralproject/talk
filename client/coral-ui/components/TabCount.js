import React from 'react';
import cn from 'classnames';
import styles from './TabCount.css';
import PropTypes from 'prop-types';

function getNumber(no) {
  let result = Number.parseInt(no);
  if (no >= 1000) {
    result = `${Math.round(result / 100) / 10}k`;
  }
  return result;
}

function getRootClassName({ className, active, sub }) {
  return cn('talk-tab-count', className, {
    [styles.root]: !sub,
    [styles.rootSub]: sub,
    [styles.rootActive]: active && !sub,
    [styles.rootSubActive]: active && sub,
    'talk-tab-active': active,
  });
}

/**
 * The `TabCount` renders a count number next to a tab name.
 */
const TabCount = ({ children, active, sub, className }) => (
  <span className={getRootClassName({ className, active, sub })}>
    {getNumber(children)}
  </span>
);

TabCount.propTypes = {
  // className to be added to the root element.
  className: PropTypes.string,

  // active indicates that the related tab is currently active.
  active: PropTypes.bool,

  // Sub indicates that this component belongs to a sub-tab-panel.
  sub: PropTypes.bool,
};

export default TabCount;
