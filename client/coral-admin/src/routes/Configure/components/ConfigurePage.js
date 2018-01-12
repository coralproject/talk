import React from 'react';
import PropTypes from 'prop-types';
import styles from './ConfigurePage.css';

const ConfigurePage = ({ title, children, ...rest }) => (
  <div {...rest}>
    <h3 className={styles.title}>{title}</h3>
    {children}
  </div>
);

ConfigurePage.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default ConfigurePage;
