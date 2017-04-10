import React, {PropTypes} from 'react';
import classnames from 'classnames';

import {Button} from 'coral-ui';
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
      timesReset: 0
    };
  }
  render() {
    const {comment, ignoreUser, addNotification} = this.props;

    // timesReset is used as Toggleable key so it re-renders on reset (closing the toggleable)
    const reset = () => this.setState({timesReset: this.state.timesReset + 1});
    const ignoreUserAndCloseMenuAndNotifyOnError = async ({id}) => {

      // close menu
      reset();

      // ignore user
      try {
        await ignoreUser({id});
      } catch (error) {
        addNotification('error', 'Failed to ignore user');
        throw error;
      }
    };
    return (
      <Toggleable key={this.state.timesReset}>
        <div style={{position: 'absolute', right: 0, zIndex: 1}}>
          <IgnoreUserWizard
            user={comment.user}
            cancel={reset}
            ignoreUser={ignoreUserAndCloseMenuAndNotifyOnError}
            />
        </div>
      </Toggleable>
    );        
  }
}

class IgnoreUserWizard extends React.Component {
  static propTypes = {

    // comment on which this menu appears
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    cancel: PropTypes.func.isRequired,

    // actually submit the ignore. Provide {id: user id to ignore}
    ignoreUser: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {

      // what step of the wizard is the user on
      step: 1
    };
    this.onClickCancel = this.onClickCancel.bind(this);
  }
  onClickCancel() {
    this.props.cancel();
  }
  render() {
    const {user, ignoreUser} = this.props;
    const goToStep = (stepNum) => this.setState({step: stepNum});
    const step1 = (
      <div>
        <header>Ignore User</header>
        <p>When you ignore a user, all comments they wrote on the site will be hidden from you. You can undo this later from the Profile tab.</p>
        <div className={styles.textAlignRight}>
          <Button cStyle='cancel' onClick={this.onClickCancel}>Cancel</Button>
          <Button onClick={() => goToStep(2)}>Ignore user</Button>
        </div>
      </div>
    );
    const onClickIgnoreUser = async () => {
      await ignoreUser({id: user.id});
    };
    const step2Confirmation = (
      <div>
        <header>Ignore User</header>
        <p>Are you sure you want to ignore { user.name }?</p>
        <div className={styles.textAlignRight}>
          <Button cStyle='cancel' onClick={this.onClickCancel}>Cancel</Button>
          <Button onClick={onClickIgnoreUser}>Ignore user</Button>
        </div>
      </div>
    );
    const elsForStep = [step1, step2Confirmation];
    const {step} = this.state;
    const elForThisStep = elsForStep[step - 1];
    return (
      <div className={styles.IgnoreUserWizard}>
        { elForThisStep }
      </div>
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
    this.setState({isOpen: ! this.state.isOpen});
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

