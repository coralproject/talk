import React from 'react';
import Checkbox from 'coral-ui/components/Checkbox';
import PropTypes from 'prop-types';
import cn from 'classnames';
import styles from './StreamConfiguration.css';
import uuid from 'uuid/v4';

class Configuration extends React.Component {
  id = uuid();

  render() {
    const {
      title,
      description,
      children,
      className,
      onCheckbox,
      checked,
      ...rest
    } = this.props;
    return (
      <div {...rest} className={cn(styles.root, className)}>
        {checked !== undefined && (
          <div className={styles.action}>
            <Checkbox
              id={this.id}
              className={styles.checkbox}
              onChange={onCheckbox}
              checked={checked}
            />
          </div>
        )}
        <div
          className={cn(styles.wrapper, {
            [styles.content]: checked !== undefined,
          })}
        >
          <label htmlFor={this.id} className={styles.title}>
            {title}
          </label>
          <div className={styles.description}>{description}</div>
          <div>{children}</div>
        </div>
      </div>
    );
  }
}

Configuration.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  className: PropTypes.string,
  onCheckbox: PropTypes.func,
  checked: PropTypes.bool,
  children: PropTypes.node,
};

export default Configuration;
