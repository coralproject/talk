import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Button } from 'plugin-api/beta/client/components/ui';
import styles from './DeleteMyAccountStep.css';
import InputField from './InputField';
import { t } from 'plugin-api/beta/client/services';

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
          {t('delete_request.step_3.subtitle')}
        </h4>
        <p className={styles.description}>
          {t('delete_request.step_3.description')}
        </p>
        <input
          className={styles.textBox}
          disabled={true}
          readOnly={true}
          value={this.phrase}
        />
        <InputField
          id="confirmPhrase"
          label={t('delete_request.step_3.type_to_confirm')}
          name="confirmPhrase"
          type="text"
          onChange={this.props.onChange}
          defaultValue=""
          hasError={this.formHasError()}
          errorMsg={t('delete_request.input_is_not_correct')}
          showError={this.state.showError}
          columnDisplay
        />
        <div className={cn(styles.actions)}>
          <Button
            className={cn(styles.button, styles.cancel)}
            onClick={this.props.cancel}
          >
            {t('delete_request.cancel')}
          </Button>
          <Button
            className={cn(styles.button, styles.danger)}
            onClick={this.deleteAndContinue}
          >
            {t('delete_request.delete_my_account')}
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
