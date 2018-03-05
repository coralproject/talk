import React from 'react';
import PropTypes from 'prop-types';
import styles from './Spinner.css';
import cn from 'classnames';

const Spinner = ({ className }) => (
  <div className={cn(styles.container, className)}>
    <svg
      className={styles.spinner}
      width="40px"
      height="40px"
      viewBox="0 0 66 66"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className={styles.path}
        fill="none"
        strokeWidth="6"
        strokeLinecap="round"
        cx="33"
        cy="33"
        r="30"
      />
    </svg>
  </div>
);

Spinner.propTypes = {
  className: PropTypes.string,
};

export default Spinner;
