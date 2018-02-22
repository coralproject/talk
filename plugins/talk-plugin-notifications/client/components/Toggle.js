import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import styles from './Toggle.css';
import uuid from 'uuid/v4';

class Toggle extends React.Component {
  id = uuid();

  render() {
    const { checked, onChange, children } = this.props;
    return (
      <div className={styles.toggle}>
        <label htmlFor={this.id} className={styles.title}>
          {children}
        </label>
        <Checkbox checked={checked} onChange={onChange} id={this.id} />
      </div>
    );
  }
}

Toggle.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

export default Toggle;
