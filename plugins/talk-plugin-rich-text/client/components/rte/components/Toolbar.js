import React from 'react';
import PropTypes from 'prop-types';
import styles from './Toolbar.css';
import cn from 'classnames';

class Toolbar extends React.Component {
  render() {
    const { className, ...rest } = this.props;
    return <div className={cn(className, styles.toolbar)} {...rest} />;
  }
}

Toolbar.propTypes = {
  className: PropTypes.string,
};

export default Toolbar;
