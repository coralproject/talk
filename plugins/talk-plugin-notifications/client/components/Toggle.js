import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'plugin-api/beta/client/components/ui';
import styles from './Toggle.css';
import uuid from 'uuid/v4';
import cn from 'classnames';

class Toggle extends React.Component {
  id = uuid();

  render() {
    const { checked, onChange, children, disabled } = this.props;
    return (
      <div className={styles.toggle}>
        <label
          htmlFor={this.id}
          className={cn(styles.title, { [styles.disabled]: disabled })}
        >
          {children}
        </label>
        <div className={styles.checkBox}>
          <Checkbox
            checked={checked}
            onChange={onChange}
            id={this.id}
            disabled={disabled}
          />
        </div>
      </div>
    );
  }
}

Toggle.propTypes = {
  disabled: PropTypes.bool,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

export default Toggle;
