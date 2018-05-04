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
import { t } from 'plugin-api/beta/client/services';

const initialState = { step: 0, formData: {} };

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
    this.props.closeDialog();
  };

  onChange = e => {
    const { name, value } = e.target;

    this.setState(state => ({
      formData: {
        ...state.formData,
        [name]: value,
      },
    }));
  };

  render() {
    const { step } = this.state;
    const { scheduledDeletionDate, organizationContactEmail } = this.props;

    return (
      <Dialog open={this.props.showDialog} className={styles.dialog}>
        <span className={styles.close} onClick={this.cancel}>
          ×
        </span>
        <h3 className={styles.title}>
          {t('delete_request.delete_my_account')}
        </h3>
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
            formData={this.state.formData}
            goToNextStep={this.goToNextStep}
            cancel={this.cancel}
            requestAccountDeletion={this.props.requestAccountDeletion}
            onChange={this.onChange}
          />
        )}
        {step === 4 && (
          <DeleteMyAccountFinalStep
            scheduledDeletionDate={scheduledDeletionDate}
            organizationContactEmail={organizationContactEmail}
            finish={this.cancel}
          />
        )}
      </Dialog>
    );
  }
}

DeleteMyAccountDialog.propTypes = {
  showDialog: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  requestAccountDeletion: PropTypes.func.isRequired,
  scheduledDeletionDate: PropTypes.any,
  organizationContactEmail: PropTypes.string.isRequired,
};

export default DeleteMyAccountDialog;
