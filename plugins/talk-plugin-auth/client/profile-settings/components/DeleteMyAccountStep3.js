import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import InputField from '../../components/InputField';

const initialState = {
  showError: false,
};

class DeleteMyAccountStep3 extends React.Component {
  state = initialState;
  phrase = 'delete';

  showError = () => {
    this.setState({
      showError: true,
    });
  };

  clear = () => {
    this.setState(initialState);
  };

  deleteAndContinue = async () => {
    if (this.formHasError()) {
      this.showError();
      return;
    }

    await this.props.requestAccountDeletion();
    this.clear();
    this.props.goToNextStep();
  };

  formHasError = () =>
    !this.props.formData.confirmPhrase ||
    this.props.formData.confirmPhrase !== this.phrase;

  render() {
    return (
      <div className={styles.step}>
        <h4 className={styles.subTitle}>
          Are you sure you want to delete your account?
        </h4>
        <p className={styles.description}>
          To confirm you would like to delete your account please type in the
          following phrase into the text box below:
        </p>
        <input
          className={styles.textBox}
          disabled={true}
          readOnly={true}
          value={this.phrase}
        />
        <InputField
          id="confirmPhrase"
          label={'Type phrase bellow to confirm'}
          name="confirmPhrase"
          type="text"
          onChange={this.props.onChange}
          defaultValue=""
          hasError={this.formHasError()}
          errorMsg={'The input is not correct'}
          showError={this.state.showError}
          columnDisplay
        />
        <div className={cn(styles.actions)}>
          <Button
            className={cn(styles.button, styles.cancel)}
            onClick={this.props.cancel}
          >
            Cancel
          </Button>
          <Button
            className={cn(styles.button, styles.danger)}
            onClick={this.deleteAndContinue}
          >
            Delete My Account
          </Button>
        </div>
      </div>
    );
  }
}

DeleteMyAccountStep3.propTypes = {
  goToNextStep: PropTypes.func.isRequired,
  requestAccountDeletion: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
};

export default DeleteMyAccountStep3;
