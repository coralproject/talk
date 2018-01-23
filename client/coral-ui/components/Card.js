import React from 'react';
import PropTypes from 'prop-types';
import styles from './Card.css';

const Card = ({ children, className, shadow = 2, ...props }) => (
  <div
    className={`${styles.base} ${className} ${styles[`shadow--${shadow}`]}`}
    {...props}
  >
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  shadow: PropTypes.number,
};

export default Card;
