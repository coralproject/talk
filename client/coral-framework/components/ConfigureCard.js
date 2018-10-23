import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import { Card } from 'coral-ui';
import { Checkbox, IconButton } from 'react-mdl';

import styles from './ConfigureCard.css';

const cn = classnames.bind(styles);

class ConfigureCard extends PureComponent {
  state = {
    isOpen: !this.props.collapsible,
  };

  toggle = () => this.setState({ isOpen: !this.state.isOpen });

  render() {
    const {
      title,
      children,
      className,
      onCheckbox,
      checked,
      collapsible,
      ...rest
    } = this.props;

    const { isOpen } = this.state;

    const iconName = isOpen ? 'keyboard_arrow_up' : 'keyboard_arrow_down';

    return (
      <Card
        {...rest}
        className={cn(styles.card, className, {
          enabledCard: checked === true,
          collapsibleCard: collapsible,
        })}
      >
        {checked !== undefined && (
          <div className={styles.action}>
            <Checkbox onChange={onCheckbox} checked={checked} />
          </div>
        )}
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            {collapsible && (
              <IconButton onClick={this.toggle} name={iconName} ripple />
            )}
          </div>
          {isOpen && (
            <div
              className={cn(styles.body, {
                disabledBody: checked === false,
              })}
            >
              {children}
            </div>
          )}
        </div>
      </Card>
    );
  }
}

ConfigureCard.propTypes = {
  title: PropTypes.string,
  className: PropTypes.string,
  onCheckbox: PropTypes.func,
  checked: PropTypes.bool,
  children: PropTypes.node,
  collapsible: PropTypes.bool,
};

export default ConfigureCard;
