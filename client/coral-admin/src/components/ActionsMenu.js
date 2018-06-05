import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'coral-ui';
import ClickOutside from 'coral-framework/components/ClickOutside';
import { Menu } from 'react-mdl';
import cn from 'classnames';
import { findDOMNode } from 'react-dom';
import styles from './ActionsMenu.css';

import t from 'coral-framework/services/i18n';

let count = 0;

class ActionsMenu extends React.Component {
  id = `actions-dropdown-${count++}`;
  menu = null;
  state = { open: false };
  timeout = null;

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleRef = ref => {
    this.menu = ref ? findDOMNode(ref).parentNode : null;
  };

  syncOpenState = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ open: this.menu.className.indexOf('is-visible') >= 0 });
    }, 150);
  };

  render() {
    const { className = '', buttonClassNames = '', label = '' } = this.props;
    return (
      <ClickOutside onClickOutside={this.syncOpenState}>
        <div
          className={cn(styles.root, className)}
          onBlur={this.syncOpenState}
          onClick={this.syncOpenState}
          onKeyUp={this.syncOpenState}
        >
          <Button
            cStyle="actions"
            className={cn(
              styles.button,
              { [styles.buttonOpen]: this.state.open },
              buttonClassNames
            )}
            disabled={false}
            id={this.id}
            onClick={this.syncOpenState}
            icon={this.props.icon}
            raised
          >
            {label ? label : t('modqueue.actions')}
            <Icon
              name={
                this.state.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'
              }
              className={styles.arrowIcon}
            />
          </Button>
          <Menu target={this.id} className={styles.menu} ref={this.handleRef}>
            {this.props.children}
          </Menu>
        </div>
      </ClickOutside>
    );
  }
}

ActionsMenu.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  buttonClassNames: PropTypes.string,
};

export default ActionsMenu;
