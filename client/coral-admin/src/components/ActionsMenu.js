import React from 'react';
import PropTypes from 'prop-types';
import {Button, Icon} from 'coral-ui';
import {Menu} from 'react-mdl';
import cn from 'classnames';
import {findDOMNode} from 'react-dom';
import styles from './ActionsMenu.css';

import t from 'coral-framework/services/i18n';

let count = 0;

class ActionsMenu extends React.Component {
  id = `actions-dropdown-${count++}`;
  menu = null;
  state = {open: false};
  timeout = null;

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  handleRef = (ref) => {
    this.menu = ref ? findDOMNode(ref).parentNode : null;
  }

  syncOpenState = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({open: this.menu.className.indexOf('is-visible') >= 0});
    }, 150);
  };

  render() {
    return (
      <div className={styles.root} onBlur={this.syncOpenState} >
        <Button
          cStyle='actions'
          className={cn(styles.button, {[styles.buttonOpen]: this.state.open})}
          disabled={false}
          id={this.id}
          onClick={this.syncOpenState}
          icon={this.props.icon}
          raised>
          {t('modqueue.actions')}
          <Icon
            name={this.state.open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
            className={styles.arrowIcon}
          />
        </Button>
        <Menu target={this.id} className={styles.menu} ref={this.handleRef}>
          {this.props.children}
        </Menu>
      </div>
    );
  }
}

ActionsMenu.propTypes = {
  icon: PropTypes.string,
  children: PropTypes.node,
};

export default ActionsMenu;
