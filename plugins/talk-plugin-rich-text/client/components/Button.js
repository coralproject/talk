import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.css';
import { Icon, BareButton } from 'plugin-api/beta/client/components/ui';
import cn from 'classnames';

class Button extends React.Component {
  render() {
    const { className, icon, title, onClick } = this.props;
    return (
      <BareButton
        className={cn(className, styles.button)}
        title={title}
        onClick={onClick}
      >
        <Icon className={styles.icon} name={icon} />
      </BareButton>
    );
  }
}

Button.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
