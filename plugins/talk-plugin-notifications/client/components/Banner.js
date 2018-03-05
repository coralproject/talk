import React from 'react';
import styles from './Banner.css';
import { Icon } from 'coral-ui';
import PropTypes from 'prop-types';
import cn from 'classnames';

function getIcon(icon, error, success) {
  if (icon) {
    return icon;
  }
  if (error) {
    return 'warning';
  }
  if (success) {
    return 'done';
  }
  return 'info';
}

const Banner = ({ title, icon, error, success, children }) => (
  <section className={styles.root}>
    <div
      className={cn(styles.leftColumn, {
        [styles.error]: error,
        [styles.success]: success,
      })}
    >
      <Icon name={getIcon(icon, error, success)} className={styles.icon} />
    </div>
    <div className={styles.rightColumn}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  </section>
);

Banner.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  error: PropTypes.bool,
  success: PropTypes.bool,
};

Banner.defaultProps = {
  title: 'Title',
  children: 'Lorem Ipsum Dolot Sit Ahmet',
};

export default Banner;
