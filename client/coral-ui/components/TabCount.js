import React from 'react';
import cn from 'classnames';
import styles from './TabCount.css';

function getNumber(no) {
  let result = Number.parseInt(no);
  if (no >= 1000) {
    result = `${Math.round(result / 100) / 10}k`;
  }
  return result;
}

function getRootClassName({className, active, sub}) {
  return cn(
    'talk-tab-count',
    className,
    {
      [styles.root]: !sub,
      [styles.rootSub]: sub,
      [styles.rootActive]: active && !sub,
      [styles.rootSubActive]: active && sub,
      'talk-tab-active': active,
    }
  );
}

export default ({children, active, sub, className}) => (
  <span className={getRootClassName({className, active, sub})}>{getNumber(children)}</span>
);
