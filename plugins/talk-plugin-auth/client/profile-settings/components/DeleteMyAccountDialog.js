import React from 'react';
import PropTypes from 'prop-types';
import styles from './DeleteMyAccountDialog.css';
import { Dialog } from 'plugin-api/beta/client/components/ui';
import StepProgress from './StepProgress';
import DeleteMyAccountStep0 from './DeleteMyAccountStep0';
import DeleteMyAccountStep1 from './DeleteMyAccountStep1';
import DeleteMyAccountStep2 from './DeleteMyAccountStep2';
import DeleteMyAccountStep3 from './DeleteMyAccountStep3';
import DeleteMyAccountFinalStep from './DeleteMyAccountFinalStep';

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

  cancel = () => {
    this.clear();
    this.closeDialog();
  };

  render() {
    const { step } = this.state;
    return (
      <Dialog open={true} className={styles.dialog}>
        <span className={styles.close} onClick={this.cancel}>
          ×
        </span>
        <h3 className={styles.title}>Delete My Account</h3>
        <StepProgress currentStep={this.state.step} totalSteps={4} />
        {step === 0 && (
          <DeleteMyAccountStep0
            goToNextStep={this.goToNextStep}
            cancel={this.cancel}
          />
        )}
        {step === 1 && (
          <DeleteMyAccountStep1
            goToNextStep={this.goToNextStep}
            cancel={this.cancel}
          />
        )}
        {step === 2 && (
          <DeleteMyAccountStep2
            goToNextStep={this.goToNextStep}
            cancel={this.cancel}
          />
        )}
        {step === 3 && (
          <DeleteMyAccountStep3
            goToNextStep={this.goToNextStep}
            cancel={this.cancel}
            requestAccountDeletion={this.props.requestAccountDeletion}
          />
        )}
        {step === 4 && <DeleteMyAccountFinalStep finish={this.cancel} />}
      </Dialog>
    );
  }
}

DeleteMyAccountDialog.propTypes = {
  closeDialog: PropTypes.func.isRequired,
  requestAccountDeletion: PropTypes.func.isRequired,
};

export default DeleteMyAccountDialog;
