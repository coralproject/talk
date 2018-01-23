import React from 'react';
import PropTypes from 'prop-types';
import styles from './Comment.css';
import { Button } from 'coral-ui';

// Guides the user through ignoring another user, including confirming their decision
export class IgnoreUserWizard extends React.Component {
  static propTypes = {
    // comment on which this menu appears
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }).isRequired,
    cancel: PropTypes.func.isRequired,

    // actually submit the ignore. Provide {id: user id to ignore}
    ignoreUser: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.state = {
      // what step of the wizard is the user on
      step: 1,
    };
    this.onClickCancel = this.onClickCancel.bind(this);
  }
  onClickCancel() {
    this.props.cancel();
  }
  render() {
    const { user, ignoreUser } = this.props;
    const goToStep = stepNum => this.setState({ step: stepNum });
    const step1 = (
      <div>
        <header>Ignore User</header>
        <p>
          When you ignore a user, all comments they wrote on the site will be
          hidden from you. You can undo this later from the Profile tab.
        </p>
        <div className={styles.textAlignRight}>
          <Button cStyle="cancel" onClick={this.onClickCancel}>
            Cancel
          </Button>
          <Button onClick={() => goToStep(2)}>Ignore user</Button>
        </div>
      </div>
    );
    const onClickIgnoreUser = async () => {
      await ignoreUser({ id: user.id });
    };
    const step2Confirmation = (
      <div>
        <header>Ignore User</header>
        <p>Are you sure you want to ignore {user.username}?</p>
        <div className={styles.textAlignRight}>
          <Button cStyle="cancel" onClick={this.onClickCancel}>
            Cancel
          </Button>
          <Button onClick={onClickIgnoreUser}>Ignore user</Button>
        </div>
      </div>
    );
    const elsForStep = [step1, step2Confirmation];
    const { step } = this.state;
    const elForThisStep = elsForStep[step - 1];
    return <div className={styles.Wizard}>{elForThisStep}</div>;
  }
}
