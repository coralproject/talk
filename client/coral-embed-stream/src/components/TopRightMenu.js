import React, {PropTypes} from 'react';
import classnames from 'classnames';

import {IgnoreUserWizard} from './IgnoreUserWizard';
import styles from './TopRightMenu.css';

// TopRightMenu appears as a dropdown in the top right of the comment.
// when you click the down cehvron, it expands and shows IgnoreUserWizard
// when you click 'cancel' in the wizard, it closes the menu
export class TopRightMenu extends React.Component {
  static propTypes = {

    // comment on which this menu appears
    comment: PropTypes.shape({
      user: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired
    }).isRequired,
    ignoreUser: PropTypes.func,

    // show notification to the user (e.g. for errors)
    addNotification: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      stacked: null,
      timesReset: 0
    };
  }

  // Stack a new UI over the menu (like when you 'click into' something)
  stack(node) {
    this.setState({
      stacked: node
    });
  }
  render() {
    const {comment, ignoreUser, addNotification} = this.props;
    const {stacked} = this.state;

    // timesReset is used as Toggleable key so it re-renders on reset (closing the toggleable)
    const closeMenu = () => this.setState({
      timesReset: this.state.timesReset + 1
    });

    // unstack to return to the menuItems
    const unstack = () => this.setState({
      stacked: null,
    });
    const ignoreUserAndCloseMenuAndNotifyOnError = async ({id}) => {
      closeMenu();

      // ignore user
      try {
        await ignoreUser({id});
      } catch (error) {
        addNotification('error', 'Failed to ignore user');
        throw error;
      }
    };
    const menuItems = <ul className={styles.menuItemList}>
      <li className={styles.menuItem}
          onClick={() => this.stack(
            <div className={styles.Wizard}>
              <p>Report Username Wizard goes here</p>
              <button onClick={() => unstack()}>Cancel</button>
            </div>
          )}>
        <header>Report display name</header>
        <span>Report a display name to our moderation team</span>
      </li>
      <li className={styles.menuItem}
          onClick={() => this.stack(
            <IgnoreUserWizard
              user={comment.user}
              cancel={unstack}
              ignoreUser={ignoreUserAndCloseMenuAndNotifyOnError}
            />
          )}>
        <header>Ignore commenter</header>
        <span>Hide comments from a specific commenter. Can be undone.</span>
      </li>
    </ul>;
    return (
      <Toggleable key={this.state.timesReset}>
        <div className={styles.menu}>
          { stacked
            ? stacked
            : menuItems }
        </div>
      </Toggleable>
    );        
  }
}

const upArrow = <span className={classnames(styles.chevron, styles.up)}></span>;
const downArrow = <span className={classnames(styles.chevron, styles.down)}></span>;
class Toggleable extends React.Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.close = this.close.bind(this);
    this.state = {
      isOpen: false
    };
  }
  toggle() {
    this.setState({isOpen: !this.state.isOpen});
  }
  close() {
    this.setState({isOpen: false});
  }
  render() {
    const {children} = this.props;
    const {isOpen} = this.state;
    return (

      // /*onBlur={ this.close } */
      <span className={styles.Toggleable} tabIndex="0" >
        <span className={styles.toggler}
              onClick={this.toggle}>{isOpen ? upArrow : downArrow}</span>
        {isOpen ? children : null}
      </span>
    );
  }
}

