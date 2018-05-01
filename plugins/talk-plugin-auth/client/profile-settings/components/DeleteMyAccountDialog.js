import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import styles from './DeleteMyAccountDialog.css';
import { Button, Dialog, Icon } from 'plugin-api/beta/client/components/ui';
import StepProgress from './StepProgress';

const initialState = { step: 0 };

class DeleteMyAccountDialog extends React.Component {
  state = initialState;

  goToNextStep = () => {
    this.setState(state => ({
      step: state.step + 1,
    }));
  };

  clear = () => {
    this.setState(initialState);
  };

  render() {
    return (
      <Dialog open={true} className={styles.dialog}>
        <span className={styles.close} onClick={this.props.closeDialog}>
          ×
        </span>
        <h3 className={styles.title}>Delete My Account</h3>
        <StepProgress currentStep={this.state.step} totalSteps={4} />
        <div className={styles.step}>
          <p className={styles.description}>
            You are attempting to delete your account. This means:
          </p>
          <ul className={styles.list}>
            <li className={styles.item}>
              <Icon name="done" className={styles.itemIcon} />
              <span className={styles.text}>
                All of your comments are removed from this site
              </span>
            </li>
            <li className={styles.item}>
              <Icon name="done" className={styles.itemIcon} />
              <span className={styles.text}>
                All of your comments are deleted from our database
              </span>
            </li>
            <li className={styles.item}>
              <Icon name="done" className={styles.itemIcon} />
              <span className={styles.text}>
                Your username and email address are removed from our system
              </span>
            </li>
          </ul>
        </div>
        <div className={cn(styles.actions)}>
          <Button className={cn(styles.button, styles.cancel)}>Cancel</Button>
          <Button className={cn(styles.button, styles.proceed)}>Proceed</Button>
        </div>
      </Dialog>
    );
  }
}

DeleteMyAccountDialog.propTypes = {
  closeDialog: PropTypes.func.isRequired,
};

export default DeleteMyAccountDialog;
